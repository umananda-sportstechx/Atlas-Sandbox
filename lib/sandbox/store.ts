'use client';

import { useSyncExternalStore } from 'react';
import type { SandboxProduct } from './types';

/**
 * "The Warm-Up" practice state, kept in this browser only.
 *
 * Front-end only by design: the flag changes what the UI shows and which
 * requests are answered locally — it grants nothing on the server, where the
 * user stays on Explore. No time limit; a walkthrough can be replayed any time.
 *
 * Two phases per run:
 *   - `tour`  — the guided steps (lib/sandbox/tours/*), writes work on sample data;
 *   - `view`  — after the tour (or a skip): the same workspace, view-only.
 */
export type PracticePhase = 'tour' | 'view';

export interface PracticeState {
	/** Product open in practice right now, or null when outside it. */
	active: SandboxProduct | null;
	phase: PracticePhase;
	/** Current tour step (index into the tour's steps; === steps.length is the finale). */
	step: number;
}

const KEY = 'stx:sandbox:v2';
/** The retired 7-day "Try Sandbox" record; dropped on the next write. */
const LEGACY_KEY = 'stx:sandbox:v1';
const EVENT = 'stx:sandbox';

const EMPTY: PracticeState = { active: null, phase: 'tour', step: 0 };

function parse(raw: string | null): PracticeState {
	if (!raw) return EMPTY;
	try {
		const v = JSON.parse(raw) as Partial<PracticeState>;
		const active = v.active === 'raise' || v.active === 'scout' ? v.active : null;
		const phase: PracticePhase = v.phase === 'view' ? 'view' : 'tour';
		const step = Number.isInteger(v.step) && (v.step as number) >= 0 ? (v.step as number) : 0;
		return { active, phase, step };
	} catch { return EMPTY; }
}

function rawState(): string | null {
	if (typeof window === 'undefined') return null;
	try { return localStorage.getItem(KEY); } catch { return null; }
}

const read = (): PracticeState => parse(rawState());

function write(next: PracticeState) {
	try {
		localStorage.setItem(KEY, JSON.stringify(next));
		localStorage.removeItem(LEGACY_KEY);
	} catch { /* storage unavailable */ }
	window.dispatchEvent(new Event(EVENT));
}

/** The product open in practice right now, or null. Kept under its old name — many callers. */
export function activeSandbox(): SandboxProduct | null {
	return read().active;
}

/** The practice phase, or null outside practice. */
export function practicePhase(): PracticePhase | null {
	const s = read();
	return s.active ? s.phase : null;
}

/** Enter a product's walkthrough at its first step, on a fresh sample workspace. */
export function startWalkthrough(product: SandboxProduct) {
	resetSandboxData(product);
	clearStepSnapshots(product);
	write({ active: product, phase: 'tour', step: 0 });
}

export function setTourStep(step: number) {
	const s = read();
	if (!s.active) return;
	write({ ...s, step: Math.max(0, Math.floor(step)) });
}

/** Tour over (finished or skipped): stay in the workspace, view-only. */
export function finishTour() {
	const s = read();
	if (!s.active) return;
	write({ ...s, phase: 'view', step: 0 });
}

/** Run the active product's tour again from step 1, on a fresh sample workspace. */
export function replayTour() {
	const s = read();
	if (!s.active) return;
	startWalkthrough(s.active);
}

export function exitPractice() {
	write(EMPTY);
}

function subscribe(cb: () => void) {
	window.addEventListener(EVENT, cb);
	window.addEventListener('storage', cb);
	return () => { window.removeEventListener(EVENT, cb); window.removeEventListener('storage', cb); };
}

/** React view of practice: `{ active, phase, step }`. Re-renders on any change (also from other tabs). */
export function useSandbox(): PracticeState {
	const raw = useSyncExternalStore(subscribe, () => rawState() ?? '', () => '');
	return parse(raw || null);
}

/** Alias of useSandbox, for code that talks about "practice". */
export const usePractice = useSandbox;

/** Per-product sample data (pipeline moves, thesis edits, watchlists…) for the request handlers. */
const DATA_KEY = (p: SandboxProduct) => `stx:sandbox:data:${p}`;
export function readSandboxData(p: SandboxProduct): Record<string, unknown> {
	try { return JSON.parse(localStorage.getItem(DATA_KEY(p)) ?? '{}') as Record<string, unknown>; } catch { return {}; }
}
export function writeSandboxData(p: SandboxProduct, data: Record<string, unknown>) {
	try { localStorage.setItem(DATA_KEY(p), JSON.stringify(data)); } catch { /* storage unavailable */ }
}
function resetSandboxData(p: SandboxProduct) {
	try {
		localStorage.removeItem(DATA_KEY(p));
		tourUiKeys().forEach((k) => localStorage.removeItem(k));
	} catch { /* storage unavailable */ }
	window.dispatchEvent(new Event(PLACEHOLDER_EVENT));
}

/*
 * Browser-only UI state the tours change outside the sample data: the Scout
 * board's stages for the sample watchlists and the List/Board switch
 * (hooks/use-placeholder-state.ts). Part of a fresh run and of each step's
 * snapshot, so Replay and Back put them back too.
 */
const PLACEHOLDER_PREFIX = 'stx:scout-placeholder:';
const PLACEHOLDER_EVENT = 'stx:placeholder';
const isTourUiKey = (k: string) =>
	k.startsWith(`${PLACEHOLDER_PREFIX}board:sandbox-`) || k === `${PLACEHOLDER_PREFIX}watchlist-view`;
function tourUiKeys(): string[] {
	const keys: string[] = [];
	for (let i = 0; i < localStorage.length; i += 1) {
		const k = localStorage.key(i);
		if (k && isTourUiKey(k)) keys.push(k);
	}
	return keys;
}

/*
 * Step snapshots: the sample workspace as it was when each tour step first
 * opened, so Back can put the previous step's state back as well as its page
 * (e.g. Fanfold not yet saved, so "Add to watchlist" works again).
 */
interface StepSnapshot { data: string | null; ui: Record<string, string> }
const SNAP_KEY = (p: SandboxProduct) => `stx:sandbox:snap:${p}`;

function readSnapshots(p: SandboxProduct): Record<string, StepSnapshot> {
	try { return JSON.parse(sessionStorage.getItem(SNAP_KEY(p)) ?? '{}') as Record<string, StepSnapshot>; } catch { return {}; }
}
function clearStepSnapshots(p: SandboxProduct) {
	try { sessionStorage.removeItem(SNAP_KEY(p)); sessionStorage.removeItem(PATHS_KEY(p)); } catch { /* storage unavailable */ }
}

/** Record the workspace as step `step` opens — once; re-entering the step keeps the first one. */
export function saveStepSnapshot(p: SandboxProduct, step: number) {
	const all = readSnapshots(p);
	if (all[step]) return;
	try {
		const ui = Object.fromEntries(tourUiKeys().map((k) => [k, localStorage.getItem(k) ?? '']));
		sessionStorage.setItem(SNAP_KEY(p), JSON.stringify({ ...all, [step]: { data: localStorage.getItem(DATA_KEY(p)), ui } }));
	} catch { /* storage unavailable — Back still restores the page, just not the data */ }
}

/*
 * Where each step actually ran — the concrete URL behind a `:param` step path
 * (e.g. the investor profile the visitor opened), so Back can reopen it.
 */
const PATHS_KEY = (p: SandboxProduct) => `stx:sandbox:paths:${p}`;
export function recordStepPath(p: SandboxProduct, step: number, path: string) {
	try {
		const all = JSON.parse(sessionStorage.getItem(PATHS_KEY(p)) ?? '{}') as Record<string, string>;
		if (all[step] !== path) sessionStorage.setItem(PATHS_KEY(p), JSON.stringify({ ...all, [step]: path }));
	} catch { /* storage unavailable */ }
}
export function stepPath(p: SandboxProduct, step: number): string | null {
	try { return (JSON.parse(sessionStorage.getItem(PATHS_KEY(p)) ?? '{}') as Record<string, string>)[step] ?? null; } catch { return null; }
}

/** Put the workspace back to how it was when step `step` opened. False when there is no snapshot. */
export function restoreStepSnapshot(p: SandboxProduct, step: number): boolean {
	const snap = readSnapshots(p)[step];
	if (!snap) return false;
	try {
		if (snap.data === null) localStorage.removeItem(DATA_KEY(p));
		else localStorage.setItem(DATA_KEY(p), snap.data);
		tourUiKeys().forEach((k) => localStorage.removeItem(k));
		Object.entries(snap.ui).forEach(([k, v]) => localStorage.setItem(k, v));
	} catch { return false; }
	// Later snapshots describe a future that no longer happened.
	const kept = Object.fromEntries(Object.entries(readSnapshots(p)).filter(([k]) => Number(k) <= step));
	try { sessionStorage.setItem(SNAP_KEY(p), JSON.stringify(kept)); } catch { /* storage unavailable */ }
	window.dispatchEvent(new Event(PLACEHOLDER_EVENT));
	return true;
}
