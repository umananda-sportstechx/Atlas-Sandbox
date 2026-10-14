'use client';

import { useEffect, useState } from 'react';

/** How long a step waits for its element to render before offering "Next". */
const FIND_TIMEOUT_MS = 5000;
/** At or below this width the coach is a bottom sheet, so targets scroll to the top half instead of the centre. */
const SHEET_BREAKPOINT = 1024;

export interface TargetBox { top: number; left: number; width: number; height: number }
interface TargetState { key: string; boxes: TargetBox[]; primary: TargetBox | null; extraBoxes: TargetBox[][]; missing: boolean }

export const tourSelector = (target: string) => `[data-tour="${CSS.escape(target)}"]`;

function visibleBox(el: Element | null): TargetBox | null {
	if (!el) return null;
	const r = el.getBoundingClientRect();
	return r.width === 0 && r.height === 0 ? null : { top: r.top, left: r.left, width: r.width, height: r.height };
}

const sigOf = (b: TargetBox) => `${b.top}|${b.left}|${b.width}|${b.height}`;

/** Boxes closer than this (vertically, while overlapping horizontally) read as one block. */
const MERGE_GAP = 24;

/**
 * Joins boxes that sit next to each other into one — e.g. consecutive sidebar
 * sections, which as separate rings would draw stacked double lines between
 * every pair. Boxes elsewhere on the screen stay separate.
 */
export function mergeAdjacent(boxes: TargetBox[]): TargetBox[] {
	const sorted = [...boxes].sort((a, b) => a.top - b.top);
	return sorted.reduce<TargetBox[]>((out, b) => {
		const last = out[out.length - 1];
		const overlapsX = last && b.left < last.left + last.width && last.left < b.left + b.width;
		if (!last || !overlapsX || b.top - (last.top + last.height) > MERGE_GAP) return [...out, b];
		const left = Math.min(last.left, b.left);
		const right = Math.max(last.left + last.width, b.left + b.width);
		const bottom = Math.max(last.top + last.height, b.top + b.height);
		return [...out.slice(0, -1), { top: last.top, left, width: right - left, height: bottom - last.top }];
	}, []);
}

/**
 * Tracks the on-screen boxes a step highlights: its `primary` element (the
 * step's target) plus every element matching `extra` (orientation highlights,
 * the popover option a step allows), also returned per selector as `extraBoxes`.
 *
 * One rAF loop re-queries them every frame: pages render late (SWR), re-render
 * the node, scroll, resize and reflow, and a per-frame read covers all of those
 * with no observers to keep in sync. State only changes when a box does. The
 * primary element is scrolled into view the first time it is found; if it is
 * absent for FIND_TIMEOUT_MS the step reports `missing` (the coach then offers
 * "Next"). Without a primary selector, the first `extra` box is scrolled to.
 *
 * `stepKey` resets the search whenever the step changes.
 */
export function useTourTargets(primary: string | undefined, extra: string[], stepKey: string): { boxes: TargetBox[]; primary: TargetBox | null; extraBoxes: TargetBox[][]; missing: boolean } {
	const [state, setState] = useState<TargetState>({ key: '', boxes: [], primary: null, extraBoxes: [], missing: false });
	const extraKey = extra.join('\n');

	useEffect(() => {
		const others = extraKey ? extraKey.split('\n') : [];
		if (!primary && others.length === 0) return;
		let lastSeen = performance.now();
		let scrolled = false;
		let sig = '';
		let raf = 0;
		const tick = () => {
			const el = primary ? document.querySelector(primary) : null;
			const main = visibleBox(el);
			const extraBoxes = others.map((sel) => Array.from(document.querySelectorAll(sel)).map(visibleBox).filter((b): b is TargetBox => !!b));
			const rest = extraBoxes.flat();
			const now = performance.now();
			const scrollTo = el && main ? el : !primary && rest.length ? document.querySelector(others[0]) : null;
			if (scrollTo && !scrolled) {
				scrolled = true;
				const sheet = window.innerWidth <= SHEET_BREAKPOINT;
				scrollTo.scrollIntoView({ block: sheet ? 'start' : 'center', behavior: 'smooth' });
			}
			if (main) lastSeen = now;
			const missing = !!primary && !main && now - lastSeen > FIND_TIMEOUT_MS;
			const boxes = main ? [main, ...rest] : rest;
			const next = `${boxes.map(sigOf).join(';')}|${main ? 'm' : ''}|${missing ? 'missing' : ''}`;
			if (next !== sig) {
				sig = next;
				setState({ key: stepKey, boxes, primary: main, extraBoxes, missing });
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [primary, extraKey, stepKey]);

	return state.key === stepKey ? state : { boxes: [], primary: null, extraBoxes: [], missing: false };
}
