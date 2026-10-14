'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Footprints, RotateCcw } from 'lucide-react';
import type { Inputs, Step, Tier, Tour } from '@/lib/types';

const GET_ATLAS_HREF = 'https://sportstechx.com';

interface Box { top: number; left: number; width: number; height: number }

interface CoachProps {
  tier: Tier;
  tour: Tour;
  step: number;
  total: number;
  showIntro: boolean;
  isFinale: boolean;
  current: Step | null;
  inputs: Inputs;
  onStart: () => void;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onFinish: (choice: 'replay' | 'switch') => void;
  onInput: (key: string, value: string) => void;
}

const PRODUCT_NAME: Record<Tier, string> = { explore: 'Explore', raise: 'Raise', scout: 'Scout' };

/**
 * The guide. Intro → steps → finale. Each step may spotlight a `data-spot`
 * element on the mock screen (click it or press Next to advance) and may ask the
 * user to type something (`prompt`). It never hard-stalls: Next is always there.
 */
export function Coach(props: CoachProps) {
  const { tier, tour, step, total, showIntro, isFinale, current, inputs } = props;
  const spot = !showIntro && !isFinale ? current?.spotlight : undefined;
  const [box, setBox] = useState<Box | null>(null);

  // Reserve the right gutter so the panel never covers the page.
  useEffect(() => {
    document.body.classList.add('sbx-coached');
    return () => document.body.classList.remove('sbx-coached');
  }, []);

  // Find + ring the spotlight target; clicking it advances. Re-measures on
  // resize and whenever the step changes. Missing target → no ring, Next works.
  const onNextRef = useRef(props.onNext);
  onNextRef.current = props.onNext;
  useEffect(() => {
    if (!spot) { setBox(null); return; }
    let raf = 0;
    const el = () => document.querySelector<HTMLElement>(`[data-spot="${spot}"]`);
    const measure = () => {
      const node = el();
      if (!node) { setBox(null); return; }
      const r = node.getBoundingClientRect();
      setBox({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    const node = el();
    node?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    // Let the smooth scroll settle before measuring.
    raf = window.setTimeout(measure, 320);
    const click = (e: Event) => { if ((e.target as Element)?.closest?.(`[data-spot="${spot}"]`)) onNextRef.current(); };
    window.addEventListener('resize', measure);
    document.addEventListener('click', click, true);
    return () => { window.clearTimeout(raf); window.removeEventListener('resize', measure); document.removeEventListener('click', click, true); };
  }, [spot, step]);

  const label = PRODUCT_NAME[tier];

  return (
    <>
      {box && (
        <div className="sbx-spot" style={{ top: box.top - 6, left: box.left - 6, width: box.width + 12, height: box.height + 12 }} aria-hidden />
      )}
      <aside className="sbx-coach" aria-label={`Guided tour: Atlas ${label}`}>
        <div className="sbx-coach__eyebrow"><Footprints size={12} /> Guided tour · Atlas {label}</div>

        {showIntro ? (
          <div className="sbx-coach__body">
            <h2 className="sbx-coach__title">{tour.intro.title}</h2>
            <p className="sbx-coach__text">{tour.intro.body}</p>
            <p className="sbx-coach__note">{total} short steps · sample data · nothing is saved</p>
            <div className="sbx-coach__actions">
              <button className="sbx-btn sbx-btn--ghost" onClick={() => props.onFinish('switch')}>Pick another</button>
              <button className="sbx-btn sbx-btn--solid" onClick={props.onStart}>Start <ArrowRight size={14} /></button>
            </div>
          </div>
        ) : isFinale ? (
          <div className="sbx-coach__body">
            <h2 className="sbx-coach__title">{tour.finale.title}</h2>
            <p className="sbx-coach__text">{tour.finale.body}</p>
            <div className="sbx-coach__stack">
              <a className="sbx-btn sbx-btn--solid" href={GET_ATLAS_HREF} target="_blank" rel="noreferrer">Get Atlas {label}</a>
              <button className="sbx-btn sbx-btn--outline" onClick={() => props.onFinish('switch')}>Try another tour</button>
              <button className="sbx-btn sbx-btn--ghost" onClick={() => props.onFinish('replay')}><RotateCcw size={13} /> Replay</button>
            </div>
          </div>
        ) : current && (
          <div className="sbx-coach__body">
            <div className="sbx-coach__progress">
              <span>Step {step + 1} of {total}</span>
              <span className="sbx-coach__track"><span style={{ width: `${((step + 1) / total) * 100}%` }} /></span>
            </div>
            <h2 className="sbx-coach__title">{current.title}</h2>
            <p className="sbx-coach__text">{current.body}</p>

            {current.prompt && (
              <form
                className="sbx-coach__prompt"
                onSubmit={(e) => { e.preventDefault(); props.onNext(); }}
              >
                <label className="sbx-coach__promptlabel">{current.prompt.label}</label>
                <input
                  className="sbx-input"
                  placeholder={current.prompt.placeholder}
                  value={inputs[current.prompt.key] ?? ''}
                  onChange={(e) => props.onInput(current.prompt!.key, e.target.value)}
                  autoFocus
                />
                <button type="submit" className="sbx-btn sbx-btn--solid sbx-btn--full">{current.prompt.cta ?? 'Continue'} <ArrowRight size={14} /></button>
              </form>
            )}

            {box && <p className="sbx-coach__cue">← Look for the highlight on the left</p>}

            <div className="sbx-coach__actions">
              <button className="sbx-btn sbx-btn--ghost" onClick={props.onBack}><ArrowLeft size={13} /> Back</button>
              <button className="sbx-btn sbx-btn--ghost" onClick={props.onSkip}>Skip</button>
              {!current.prompt && <button className="sbx-btn sbx-btn--solid" onClick={props.onNext}>Next <ArrowRight size={14} /></button>}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
