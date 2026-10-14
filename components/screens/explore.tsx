'use client';

import { FileText, Search } from 'lucide-react';
import type { ScreenProps } from '@/lib/types';
import { EXPLORE } from '@/lib/demo-data';
import { Chip, Eyebrow, Logo, PageHead, Tile } from './ui';

/** Atlas Explore — the free browse tier, mocked. */
export function ScreenExplore({ screen, inputs }: ScreenProps) {
  const q = inputs.q?.trim();

  if (screen === 'home') {
    return (
      <div className="atlas-screen">
        <PageHead title="Explore the sports-tech market" sub="Free access to the people, companies and capital shaping sports" />
        <div className="sbx-grid3" data-spot="explore-stats">
          <Tile accent><Eyebrow>Companies</Eyebrow><div className="sbx-stat">{EXPLORE.stats.companies}</div><span className="sbx-stat__note">mapped</span></Tile>
          <Tile><Eyebrow>Investors</Eyebrow><div className="sbx-stat">{EXPLORE.stats.investors}</div><span className="sbx-stat__note">tracked</span></Tile>
          <Tile><Eyebrow>Countries</Eyebrow><div className="sbx-stat">{EXPLORE.stats.countries}</div><span className="sbx-stat__note">covered</span></Tile>
        </div>
      </div>
    );
  }

  if (screen === 'companies') {
    return (
      <div className="atlas-screen">
        <PageHead title="Companies" sub={q ? `Results for “${q}”` : 'Every sports-tech company, mapped'} />
        <div className="sbx-searchbar"><Search size={14} /> {q || 'Search companies, sectors, geographies'}</div>
        <div className="sbx-rows">
          {EXPLORE.companies.map((c, i) => (
            <div key={c.name} className="sbx-row" data-spot={i === 0 ? 'company-row' : undefined}>
              <Logo name={c.name} size={30} />
              <span className="sbx-row__name">{c.name}</span>
              <span className="sbx-row__meta">{c.sector} · {c.hq}</span>
              <span className="sbx-row__when">{c.raised}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'funding') {
    return (
      <div className="atlas-screen">
        <PageHead title="Funding" sub="Every round, as it happens" />
        <div className="sbx-rows">
          {EXPLORE.funding.map((f, i) => (
            <div key={f.name} className="sbx-row" data-spot={i === 0 ? 'funding-row' : undefined}>
              <Logo name={f.name} size={30} />
              <span className="sbx-row__name">{f.name}</span>
              <span className="sbx-row__meta">{f.round}</span>
              <span className="sbx-row__amount">{f.amount}</span>
              <span className="sbx-row__when">{f.when}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'acquisitions') {
    return (
      <div className="atlas-screen">
        <PageHead title="Acquisitions" sub="Who bought whom, and for how much" />
        <div className="sbx-rows">
          {EXPLORE.acquisitions.map((a, i) => (
            <div key={a.target} className="sbx-row" data-spot={i === 0 ? 'acq-row' : undefined}>
              <span className="sbx-row__name">{a.buyer} <span className="sbx-row__arrow">acquired</span> {a.target}</span>
              <span className="sbx-row__amount">{a.amount}</span>
              <span className="sbx-row__when">{a.when}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'reports') {
    return (
      <div className="atlas-screen">
        <PageHead title="Reports" sub="Deep dives and quarterly roundups" />
        <div className="sbx-cards">
          {EXPLORE.reports.map((r, i) => (
            <Tile key={r.title} className="sbx-report" spot={i === 0 ? 'report-card' : undefined}>
              <FileText size={20} />
              <div className="sbx-report__title">{r.title}</div>
              <Chip tone="muted">{r.tag}</Chip>
            </Tile>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
