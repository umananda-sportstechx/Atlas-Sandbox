'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Tier } from '@/lib/types';
import { readUrl, writeUrl } from '@/lib/url-state';
import { TOURS } from '@/lib/steps';
import { Chooser } from './chooser';
import { MockShell } from './mock-shell';
import { Coach } from './coach';

/**
 * The entire demo. State is just `{ tier, step, inputs }`:
 *   - no tier  → the tier chooser (the first thing everyone sees);
 *   - a tier   → that tour runs over the mock app, the coach driving every step.
 * `tier`+`step` live in the URL; `inputs` (what the user typed at prompt steps)
 * is kept in memory and read back by the mock screens.
 */
export function Sandbox() {
  const [tier, setTier] = useState<Tier | null>(null);
  const [step, setStep] = useState(0);
  const [started, setStarted] = useState(false);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);

  // Hydrate from the URL once on the client, then follow Back/Forward.
  useEffect(() => {
    const apply = () => {
      const u = readUrl();
      setTier(u.tier);
      setStep(u.step);
      setStarted(u.step > 0);
      setReady(true);
    };
    apply();
    window.addEventListener('popstate', apply);
    return () => window.removeEventListener('popstate', apply);
  }, []);

  const go = useCallback((nextTier: Tier | null, nextStep: number) => {
    setTier(nextTier);
    setStep(nextStep);
    writeUrl({ tier: nextTier, step: nextStep });
  }, []);

  const pick = useCallback((t: Tier) => { setStarted(false); go(t, 0); }, [go]);
  const setInput = useCallback((key: string, value: string) => setInputs((s) => ({ ...s, [key]: value })), []);

  if (!ready) return null;
  if (!tier) return <Chooser onPick={pick} />;

  const tour = TOURS[tier];
  const total = tour.steps.length;
  const clamped = Math.min(Math.max(step, 0), total);
  const isFinale = clamped >= total;
  const showIntro = clamped === 0 && !started;
  const current = isFinale ? null : tour.steps[clamped];
  const screen = current?.screen ?? tour.steps[total - 1].screen;
  const navKey = current?.nav ?? current?.screen ?? tour.steps[total - 1].screen;

  const next = () => { if (!isFinale) go(tier, clamped + 1); };
  const back = () => {
    if (showIntro) { setTier(null); writeUrl({ tier: null, step: 0 }); return; }
    if (clamped === 0) { setStarted(false); return; }
    go(tier, clamped - 1);
  };
  const skip = () => go(tier, total);
  const finish = (choice: 'replay' | 'switch') => {
    if (choice === 'switch') { setTier(null); writeUrl({ tier: null, step: 0 }); }
    else { setStarted(false); go(tier, 0); }
  };

  return (
    <>
      <MockShell tier={tier} screen={screen} navKey={navKey} inputs={inputs} />
      <Coach
        tier={tier}
        tour={tour}
        step={clamped}
        total={total}
        showIntro={showIntro}
        isFinale={isFinale}
        current={current}
        inputs={inputs}
        onStart={() => setStarted(true)}
        onNext={next}
        onBack={back}
        onSkip={skip}
        onFinish={finish}
        onInput={setInput}
      />
    </>
  );
}
