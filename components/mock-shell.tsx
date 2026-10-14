'use client';

import {
  Bell, Bot, Building2, FileText, Handshake, Home, LineChart, type LucideIcon,
  Radio, Search, Telescope, TrendingUp, Wallet,
} from 'lucide-react';
import type { Inputs, Tier } from '@/lib/types';
import { ScreenExplore } from './screens/explore';
import { ScreenRaise } from './screens/raise';
import { ScreenScout } from './screens/scout';

interface NavItem { key: string; label: string; icon: LucideIcon }

/** Static sidebar per tier. The tour decides what shows — these never navigate. */
const NAV: Record<Tier, NavItem[]> = {
  explore: [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'companies', label: 'Companies', icon: Building2 },
    { key: 'funding', label: 'Funding', icon: TrendingUp },
    { key: 'acquisitions', label: 'Acquisitions', icon: Handshake },
    { key: 'reports', label: 'Reports', icon: FileText },
  ],
  raise: [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'deck', label: 'Deck analysis', icon: FileText },
    { key: 'investors', label: 'Investors', icon: Wallet },
    { key: 'pipeline', label: 'Pipeline', icon: LineChart },
    { key: 'market', label: 'My market', icon: TrendingUp },
    { key: 'chat', label: 'Co-pilot', icon: Bot },
  ],
  scout: [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'recommended', label: 'Matches', icon: Telescope },
    { key: 'watchlists', label: 'Watchlists', icon: Building2 },
    { key: 'signals', label: 'Signals', icon: Radio },
    { key: 'deal-flow', label: 'Deal flow', icon: Handshake },
    { key: 'deck', label: 'Deck screener', icon: FileText },
  ],
};

const PRODUCT: Record<Tier, { name: string; accent: string }> = {
  explore: { name: 'Explore', accent: 'var(--a-ink)' },
  raise: { name: 'Raise', accent: 'var(--a-navy)' },
  scout: { name: 'Scout', accent: 'var(--a-purple)' },
};

export function MockShell({ tier, screen, navKey, inputs }: { tier: Tier; screen: string; navKey: string; inputs: Inputs }) {
  const product = PRODUCT[tier];
  return (
    <div className="sbx-shell" style={{ ['--sbx-accent' as string]: product.accent }}>
      <aside className="sbx-rail" aria-hidden>
        <div className="sbx-brand">
          Atlas <span className="sbx-brand__tag" style={{ color: product.accent }}>{product.name}</span>
        </div>
        <nav className="sbx-nav">
          {NAV[tier].map((n) => {
            const Icon = n.icon;
            return (
              <span key={n.key} className={`sbx-nav__item${n.key === navKey ? ' is-active' : ''}`}>
                <Icon size={16} aria-hidden /> {n.label}
              </span>
            );
          })}
        </nav>
      </aside>
      <div className="sbx-main">
        <header className="sbx-topbar" aria-hidden>
          <div className="sbx-topbar__search"><Search size={13} /> Search Atlas</div>
          <div className="sbx-topbar__right"><Bell size={15} /><span className="sbx-topbar__avatar">JE</span></div>
        </header>
        <div className="sbx-canvas">
          {tier === 'explore' && <ScreenExplore screen={screen} inputs={inputs} tier={tier} />}
          {tier === 'raise' && <ScreenRaise screen={screen} inputs={inputs} tier={tier} />}
          {tier === 'scout' && <ScreenScout screen={screen} inputs={inputs} tier={tier} />}
        </div>
      </div>
    </div>
  );
}
