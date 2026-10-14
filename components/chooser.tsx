'use client';

import { ArrowRight, Compass, LineChart, Telescope } from 'lucide-react';
import type { Tier } from '@/lib/types';

const CHOICES: { tier: Tier; name: string; who: string; body: string; icon: React.ReactNode }[] = [
  {
    tier: 'explore',
    name: 'Explore',
    who: 'Free',
    body: 'Browse the whole sports-tech market — companies, funding, acquisitions and reports. See what Atlas gives you before you pay a cent.',
    icon: <Compass size={22} aria-hidden />,
  },
  {
    tier: 'raise',
    name: 'Raise',
    who: 'For founders',
    body: 'You’re a founder mid-raise. Score your deck, get matched investors, and run your pipeline to close.',
    icon: <LineChart size={22} aria-hidden />,
  },
  {
    tier: 'scout',
    name: 'Scout',
    who: 'For investors',
    body: 'You’re an investor sourcing deals. Match your thesis, build a watchlist, and work verified deal flow.',
    icon: <Telescope size={22} aria-hidden />,
  },
];

/** Step 0 for everyone: pick which side of the table you're on. */
export function Chooser({ onPick }: { onPick: (t: Tier) => void }) {
  return (
    <main className="sbx-choose">
      <div className="sbx-choose__inner">
        <span className="atlas-eyebrow">Interactive demo · sample data</span>
        <h1 className="atlas-h1 sbx-choose__title">Take a tour of Atlas</h1>
        <p className="sbx-choose__lead">
          A guided, hands-on walk through the platform — the app drives itself and shows you each page.
          Nothing here is real and nothing is saved. Which one are you?
        </p>
        <div className="sbx-choose__grid">
          {CHOICES.map((c) => (
            <button key={c.tier} type="button" className={`sbx-card sbx-card--${c.tier}`} onClick={() => onPick(c.tier)}>
              <span className="sbx-card__icon">{c.icon}</span>
              <span className="sbx-card__who">{c.who}</span>
              <span className="sbx-card__name">Atlas {c.name}</span>
              <span className="sbx-card__body">{c.body}</span>
              <span className="sbx-card__go">Start tour <ArrowRight size={14} aria-hidden /></span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
