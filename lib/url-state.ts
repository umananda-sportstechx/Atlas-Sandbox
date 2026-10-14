import { isTier, type Tier } from './types';

/**
 * The whole demo state is two values in the URL — `?tier=scout&step=3` — so a
 * step is shareable and the browser's Back/Forward walk the tour (Kondo-style).
 * We read/write `window.location` directly rather than next/navigation: it's a
 * static export, purely client-side, and this needs no Suspense boundary.
 */
export interface UrlState {
  tier: Tier | null;
  step: number;
}

export function readUrl(): UrlState {
  if (typeof window === 'undefined') return { tier: null, step: 0 };
  const p = new URLSearchParams(window.location.search);
  const tier = p.get('tier');
  const stepRaw = Number(p.get('step') ?? 0);
  return {
    tier: isTier(tier) ? tier : null,
    step: Number.isInteger(stepRaw) && stepRaw >= 0 ? stepRaw : 0,
  };
}

export function writeUrl({ tier, step }: UrlState) {
  if (typeof window === 'undefined') return;
  const p = new URLSearchParams();
  if (tier) p.set('tier', tier);
  p.set('step', String(step));
  window.history.pushState(null, '', `${window.location.pathname}?${p.toString()}`);
}
