'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { ArrowLeft, ArrowRight, CheckCircle2, Footprints, LifeBuoy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/atlas';
import { recordStepPath, restoreStepSnapshot, saveStepSnapshot, setTourStep, stepPath, usePractice } from '@/lib/sandbox/store';
import { matchPath } from '@/lib/sandbox/match-path';
import type { Tour, TourStep } from '@/lib/sandbox/tour-types';
import type { SandboxProduct } from '@/lib/sandbox/types';
import { hrefOf } from '@/lib/routes';
import { previewBasePath } from '@/lib/preview-mode';
import { track } from '@/lib/analytics';
import { CoachText } from './coach-text';
import { leavePractice, restartPractice } from './practice-actions';
import { PRODUCT_NAME, TOURS, stepNumbers } from './tours';
import { useTourAdvance } from './use-tour-advance';
import { useTourGuard } from './use-tour-guard';
import { mergeAdjacent, tourSelector, useTourTargets, type TargetBox } from './use-tour-target';
import './walkthrough.css';

const HELP_HREF = 'mailto:hello@sportstechx.com?subject=The%20Warm-Up%20question';
/** Full-height panel width (desktop) — keep in sync with --wt-panel-w in walkthrough.css. */
const PANEL_WIDTH = 360;
/** A target under the docked panel flips it to the other side. */
const PANEL_CLEARANCE = PANEL_WIDTH + 40;
const SPOTLIGHT_PAD = 6;
const NO_SELECTORS: string[] = [];

const hasParams = (path: string) => /\/:/.test(path);

function isTyping(el: EventTarget | null): boolean {
	if (!(el instanceof HTMLElement)) return false;
	return el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName);
}

/**
 * The Warm-Up coach: the guided demo over the real app (lib/sandbox/tours).
 * Mounted by the shell only while practice is in its `tour` phase.
 *
 * Welcome → steps → completion. Each step opens on its page, dims the rest of
 * the screen around its highlighted element, lets only that element be used
 * (use-tour-guard.ts) and waits for its advance condition. Back reopens the
 * previous step's page with the sample data as it was then; Skip goes straight
 * to the completion screen, which offers only "Get Atlas X" or a replay.
 */
export function WalkthroughCoach() {
	const { active, phase, step } = usePractice();
	if (!active || phase !== 'tour') return null;
	return <Coach product={active} tour={TOURS[active]} step={step} />;
}

function Coach({ product, tour, step }: { product: SandboxProduct; tour: Tour; step: number }) {
	const router = useRouter();
	const { mutate } = useSWRConfig();
	const rawPathname = usePathname() ?? '';
	// Tour step paths (lib/sandbox/tours/*) are canonical, un-prefixed paths —
	// frozen into the Tour object at module load, long before a preview base
	// path could exist. Strip it back off here so every comparison below stays
	// the same in both contexts; only the actual navigation re-adds it.
	const base = previewBasePath();
	const pathname = base && rawPathname.startsWith(base) ? rawPathname.slice(base.length) || '/' : rawPathname;
	const [introDone, setIntroDone] = useState(step > 0);
	const count = tour.steps.length;
	const { total, numberOf } = stepNumbers(tour);
	const showIntro = step === 0 && !introDone;
	const isFinale = step >= count;
	const current: TourStep | null = showIntro || isFinale ? null : tour.steps[step];
	const stepKey = current ? `${step}:${current.id}` : showIntro ? 'intro' : 'finale';

	// Where each step actually ran, so Back can reopen a `:param` page.
	useEffect(() => {
		if (current && matchPath(current.path, pathname)) recordStepPath(product, step, pathname);
	}, [current, pathname, step, product]);

	// Open the step's page once per step.
	const navigatedFor = useRef('');
	useEffect(() => {
		if (!current || navigatedFor.current === stepKey) return;
		navigatedFor.current = stepKey;
		if (matchPath(current.path, pathname)) return;
		const dest = hasParams(current.path) ? stepPath(product, step) : current.path;
		if (dest) router.push(base ? `${base}${dest}` : dest);
	}, [current, stepKey, step, pathname, router, base, product]);

	// The workspace as this step found it, for Back.
	useEffect(() => {
		if (current) saveStepSnapshot(product, step);
	}, [current, product, step]);

	const usable = current?.only ?? (current?.target ? tourSelector(current.target) : null);
	const allowed = current ? [...(usable ? [usable] : []), ...(current.allow ?? [])] : NO_SELECTORS;
	useTourGuard(allowed, !!current?.pointerOnly, current?.dropOn, current?.dragFrom);

	const highlightSelectors = (current?.highlights ?? []).map(tourSelector);
	const extra = current ? [...highlightSelectors, ...(current.allow ?? [])] : NO_SELECTORS;
	const { boxes: found, primary, extraBoxes, missing } = useTourTargets(current?.target ? tourSelector(current.target) : undefined, extra, stepKey);
	// Orientation highlights (e.g. consecutive sidebar sections) read as one block.
	const boxes = current?.highlights ? mergeAdjacent(found) : found;

	const advance = useCallback(() => {
		if (!current) return;
		track(`walkthrough:${product}:${current.id}:done`);
		if (current.pause) window.setTimeout(() => setTourStep(step + 1), current.pause);
		else setTourStep(step + 1);
	}, [current, product, step]);
	useTourAdvance(current, pathname, advance);

	const back = useCallback(() => {
		if (showIntro || isFinale) return;
		if (step === 0) { setIntroDone(false); return; }
		// Back lands on the start of the previous numbered step: the second half
		// of a two-part step (`continues`) needs the first half's result on screen.
		let prev = step - 1;
		while (prev > 0 && tour.steps[prev].continues) prev -= 1;
		// Put the sample data back as that step found it, then refetch
		// everything on screen from it.
		if (restoreStepSnapshot(product, prev)) void mutate(() => true);
		setTourStep(prev);
	}, [showIntro, isFinale, step, product, mutate, tour]);

	const skip = () => {
		track(`walkthrough:${product}:${current?.id ?? (showIntro ? 'intro' : 'finale')}:skip`);
		setTourStep(count);
	};
	const finish = (choice: 'signup' | 'replay') => {
		track(`walkthrough:${product}:finish`, { choice });
		// In preview there is no real account: "Get Atlas X" goes to signup, and
		// a replay lands back on the preview's own home, not the real (gated) one.
		if (choice === 'signup') leavePractice(base ? '/signup' : hrefOf('plans'));
		else restartPractice(base ? `${base}/home` : undefined);
	};

	const adv = current?.advance.kind;
	const canNext = !!current && (adv === 'next' || missing);
	const nextLabel = current?.cta ?? 'Next';
	const primaryAction = useCallback(() => {
		if (showIntro) setIntroDone(true);
		else if (canNext) advance();
	}, [showIntro, canNext, advance]);

	useCoachKeys(back, primaryAction, showIntro || canNext);

	// The panel docks on whichever side keeps the action clear: an allowed
	// element on screen (e.g. a drawer that slid in from the right) wins over
	// the target, since it is what the visitor has to use next.
	const allowBoxes = extraBoxes.slice(highlightSelectors.length).flat();
	const focus = allowBoxes.length ? allowBoxes : primary ? [primary] : [];
	const side = focus.length && focus.some((b) => b.left + b.width > window.innerWidth - PANEL_CLEARANCE) && focus.every((b) => b.left > PANEL_CLEARANCE) ? 'left' : 'right';
	const label = PRODUCT_NAME[product];

	// Full-height panel takes real screen width — give the app room beside it
	// instead of sitting on top of it, so nothing on the page is hidden behind it.
	useEffect(() => {
		document.body.classList.add('wt-coach-open', `wt-coach-open--${side}`);
		return () => document.body.classList.remove('wt-coach-open', 'wt-coach-open--left', 'wt-coach-open--right');
	}, [side]);

	const progress = (n: number) => (
		<div className="wt-coach__progress">
			<span>Step {n} of {total}</span>
			<span className="wt-coach__track" aria-hidden="true"><span style={{ width: `${(n / total) * 100}%` }} /></span>
		</div>
	);

	return (
		<>
			<Dim boxes={boxes} />
			{boxes.map((b, i) => <Ring key={i} box={b} />)}
			{current?.confirm && (
				<div className={`wt-confirm wt-confirm--${side}`}>
					<div className="wt-confirm__card" role="status" aria-live="polite">
						<CheckCircle2 className="wt-confirm__icon" size={28} aria-hidden="true" />
						<h2 className="wt-confirm__title">{current.confirm.title}</h2>
						<p className="wt-confirm__text">{current.confirm.body}</p>
						<Button size="sm" onClick={advance}>{nextLabel} <ArrowRight size={13} aria-hidden="true" /></Button>
					</div>
				</div>
			)}
			<aside className={`wt-coach wt-coach--${side}`} aria-label={`The Warm-Up: Atlas ${label}`}>
				<div className="wt-coach__eyebrow"><Footprints size={12} aria-hidden="true" /> The Warm-Up · {label}</div>
				{showIntro ? (
					<div className="wt-coach__body" aria-live="polite">
						{progress(1)}
						<h2 className="wt-coach__title wt-coach__title--big">{tour.intro.title}</h2>
						<p className="wt-coach__text"><CoachText text={tour.intro.body} /></p>
						{tour.intro.points && <Points points={tour.intro.points} />}
						<p className="wt-coach__note">Explore with sample data. No account required.</p>
						<div className="wt-coach__actions">
							<Button variant="ghost" size="sm" onClick={skip}>Skip tour</Button>
							<Button size="sm" onClick={() => setIntroDone(true)}>Start Warm-Up <ArrowRight size={13} aria-hidden="true" /></Button>
						</div>
					</div>
				) : isFinale ? (
					<div className="wt-coach__body" aria-live="polite">
						<h2 className="wt-coach__title wt-coach__title--big">{tour.finale.title}</h2>
						{tour.finale.body.split('\n\n').map((p) => <p key={p} className="wt-coach__text"><CoachText text={p} /></p>)}
						<div className="wt-coach__stack">
							<Button size="sm" onClick={() => finish('signup')}>Get Atlas {label} <ArrowRight size={13} aria-hidden="true" /></Button>
							<Button variant="outline" size="sm" onClick={() => finish('replay')}><RotateCcw size={13} aria-hidden="true" /> Replay Warm-Up</Button>
						</div>
					</div>
				) : current && (
					<div className="wt-coach__body" aria-live="polite">
						{progress(numberOf(step))}
						<h2 className="wt-coach__title wt-coach__title--big">{current.title}</h2>
						<p className="wt-coach__text wt-coach__text--lead"><CoachText text={current.body} /></p>
						{current.points && <Points points={current.points} />}
						{missing && <p className="wt-coach__note">Can&apos;t spot it on this page? Carry on with Next.</p>}
						<div className="wt-coach__actions">
							<Button variant="ghost" size="sm" onClick={back}><ArrowLeft size={13} aria-hidden="true" /> Back</Button>
							<Button variant="ghost" size="sm" onClick={skip}>Skip tour</Button>
							{/* A confirmation carries its own button on the card. */}
							{canNext && !current.confirm && <Button size="sm" onClick={advance}>{nextLabel} <ArrowRight size={13} aria-hidden="true" /></Button>}
						</div>
					</div>
				)}
				<a className="wt-coach__help" href={HELP_HREF}><LifeBuoy size={12} aria-hidden="true" /> Need a hand?</a>
			</aside>
		</>
	);
}

function Points({ points }: { points: { label: string; text: string }[] }) {
	return (
		<dl className="wt-coach__points">
			{points.map((p) => (
				<div key={p.label}><dt>{p.label}</dt><dd>{p.text}</dd></div>
			))}
		</dl>
	);
}

/** The dimmed screen, with a clear cut-out around every highlighted element. Never catches clicks — the guard decides those. */
function Dim({ boxes }: { boxes: TargetBox[] }) {
	return (
		<svg className="wt-dim" aria-hidden="true" width="100%" height="100%">
			<defs>
				<mask id="wt-dim-mask">
					<rect width="100%" height="100%" fill="white" />
					{boxes.map((b, i) => (
						<rect
							key={i} rx={8} fill="black"
							x={b.left - SPOTLIGHT_PAD} y={b.top - SPOTLIGHT_PAD}
							width={b.width + SPOTLIGHT_PAD * 2} height={b.height + SPOTLIGHT_PAD * 2}
						/>
					))}
				</mask>
			</defs>
			<rect className="wt-dim__fill" width="100%" height="100%" mask="url(#wt-dim-mask)" />
		</svg>
	);
}

/** Border and soft glow around one highlighted element. */
function Ring({ box }: { box: TargetBox }) {
	return (
		<div
			className="wt-ring"
			aria-hidden="true"
			style={{
				top: box.top - SPOTLIGHT_PAD, left: box.left - SPOTLIGHT_PAD,
				width: box.width + SPOTLIGHT_PAD * 2, height: box.height + SPOTLIGHT_PAD * 2,
			}}
		/>
	);
}

/** Escape = Back, Enter = the primary action — never while typing, on a focused control, or under another dialog. */
function useCoachKeys(back: () => void, primary: () => void, enterEnabled: boolean) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.defaultPrevented || e.isComposing || e.altKey || e.ctrlKey || e.metaKey) return;
			if (isTyping(e.target) || document.querySelector('[role="dialog"], [role="alertdialog"]')) return;
			if (e.key === 'Escape') { e.preventDefault(); back(); return; }
			if (e.key !== 'Enter' || !enterEnabled) return;
			if (e.target instanceof HTMLElement && /^(BUTTON|A)$/.test(e.target.tagName)) return;
			e.preventDefault();
			primary();
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [back, primary, enterEnabled]);
}
