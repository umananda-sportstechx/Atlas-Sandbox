'use client';

import { Bookmark, Check, FileText } from 'lucide-react';
import type { ScreenProps } from '@/lib/types';
import { SCOUT } from '@/lib/demo-data';
import { Chip, Eyebrow, Logo, Meter, PageHead, Tile } from './ui';

/** Atlas Scout — the investor workspace, mocked. Visual only; the tour drives it. */
export function ScreenScout({ screen, inputs }: ScreenProps) {
  const sector = inputs.sector?.trim();

  if (screen === 'home') {
    return (
      <div className="atlas-screen">
        <PageHead title="Good morning, Jordan" sub="Kestrel Field Ventures · seed to Series A, Europe" />
        <div className="sbx-grid3">
          <Tile><Eyebrow>Thesis matches</Eyebrow><div className="sbx-stat">24</div><span className="sbx-stat__note">companies tracked</span></Tile>
          <Tile><Eyebrow>Watchlists</Eyebrow><div className="sbx-stat">2</div><span className="sbx-stat__note">20 companies</span></Tile>
          <Tile><Eyebrow>Live deals</Eyebrow><div className="sbx-stat">11</div><span className="sbx-stat__note">verified this month</span></Tile>
        </div>
        <Eyebrow>What needs your attention</Eyebrow>
        <Tile spot="matches-card" className="sbx-attention">
          <div>
            <div className="sbx-attention__title">3 fresh matches this week</div>
            <div className="sbx-attention__body">New companies scored against your thesis are ready to review.</div>
          </div>
          <span className="sbx-attention__cta">Review matches →</span>
        </Tile>
      </div>
    );
  }

  if (screen === 'recommended') {
    return (
      <div className="atlas-screen">
        <PageHead title="Recommended for you" sub={sector ? `Top matches in ${sector}, scored against your thesis` : 'Scored against your thesis'} />
        <div className="sbx-cards">
          {SCOUT.matches.map((c, i) => (
            <Tile key={c.name} className="sbx-cocard">
              <div className="sbx-cocard__top">
                <Logo name={c.name} />
                <div>
                  <div className="sbx-cocard__name">{c.name}</div>
                  <div className="sbx-cocard__meta">{c.sector} · {c.hq}</div>
                </div>
                <span className="sbx-cocard__raised">{c.raised} · {c.round}</span>
              </div>
              <div className="sbx-why" data-spot={i === 0 ? 'why-match' : undefined}>
                <Eyebrow>Why it matches</Eyebrow>
                <div className="sbx-why__chips">{c.why.map((w) => <Chip key={w} tone="ok"><Check size={11} /> {w}</Chip>)}</div>
              </div>
            </Tile>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'company') {
    const c = SCOUT.matches[0];
    return (
      <div className="atlas-screen">
        <div className="sbx-cohead">
          <Logo name={c.name} size={62} />
          <div>
            <h1 className="atlas-h1">{c.name}</h1>
            <div className="sbx-cocard__meta">{c.sector} · {c.hq} · {c.raised} raised</div>
          </div>
          <button className="sbx-action" data-spot="save-watchlist"><Bookmark size={14} /> Add to watchlist</button>
        </div>
        <div className="sbx-grid3">
          <Tile><Eyebrow>Last round</Eyebrow><div className="sbx-stat sbx-stat--sm">{c.round}</div></Tile>
          <Tile><Eyebrow>Total raised</Eyebrow><div className="sbx-stat sbx-stat--sm">{c.raised}</div></Tile>
          <Tile><Eyebrow>HQ</Eyebrow><div className="sbx-stat sbx-stat--sm">{c.hq}</div></Tile>
        </div>
        <Tile><Eyebrow>About</Eyebrow><p className="sbx-para">Fanloop builds a fan-engagement platform turning matchday moments into year-round community and sponsorship revenue for clubs.</p></Tile>
      </div>
    );
  }

  if (screen === 'watchlists') {
    return (
      <div className="atlas-screen">
        <PageHead title="Your watchlists" sub="Every company you track, grouped your way" />
        <div className="sbx-rows">
          {SCOUT.watchlistLists.map((w, i) => (
            <div key={w.name} className="sbx-row" data-spot={i === 0 ? 'open-watchlist' : undefined}>
              <span className="sbx-row__name">{w.name}</span>
              <span className="sbx-row__meta">{w.count} companies</span>
              <span className="sbx-row__go">Open →</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'board') {
    return (
      <div className="atlas-screen">
        <PageHead title="Pitch-side shortlist" sub="Board view — line companies up by deal stage" />
        <div className="sbx-board">
          {SCOUT.stages.map((stage) => (
            <div key={stage} className="sbx-board__col">
              <div className="sbx-board__head">{stage}</div>
              {SCOUT.board.filter((b) => b.stage === stage).map((b) => (
                <div key={b.name} className="sbx-board__card">
                  <div className="sbx-board__co"><Logo name={b.name} size={26} /> {b.name}</div>
                  <select className="sbx-select" data-spot={b.name === 'Fanloop' ? 'board-stage' : undefined} defaultValue={b.stage}>
                    {SCOUT.stages.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'signals') {
    return (
      <div className="atlas-screen">
        <PageHead title="Signals" sub="Fresh funding and companies starting to raise" />
        <div className="sbx-rows">
          {SCOUT.signals.map((s) => (
            <div key={s.name} className="sbx-row">
              <Logo name={s.name} size={30} />
              <span className="sbx-row__name">{s.name}</span>
              <span className="sbx-row__meta">{s.event}</span>
              <span className="sbx-row__when">{s.when}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'deal-flow') {
    const feat = SCOUT.deals.find((d) => d.featured)!;
    return (
      <div className="atlas-screen">
        <PageHead title="Deal flow" sub="Companies raising right now, verified by SportsTechX" />
        <Tile spot="featured-deal" accent className="sbx-feature">
          <div>
            <Eyebrow>Featured this month</Eyebrow>
            <div className="sbx-feature__name">{feat.name}</div>
            <div className="sbx-cocard__meta">{feat.sector} · {feat.hq}</div>
          </div>
          <div className="sbx-feature__terms">
            <div><span>Raising</span><b>{feat.raising}</b></div>
            <div><span>Round</span><b>{feat.round}</b></div>
            <div><span>Valuation</span><b>{feat.valuation}</b></div>
          </div>
          <span className="sbx-attention__cta">View opportunity →</span>
        </Tile>
        <div className="sbx-rows">
          {SCOUT.deals.filter((d) => !d.featured).map((d) => (
            <div key={d.name} className="sbx-row">
              <Logo name={d.name} size={30} />
              <span className="sbx-row__name">{d.name}</span>
              <span className="sbx-row__meta">{d.round} · {d.raising}</span>
              <span className="sbx-row__when">{d.sector}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'deck') {
    return (
      <div className="atlas-screen">
        <PageHead title="Deck screener" sub="Atlas reads a pitch deck and scores it section by section" />
        <Tile className="sbx-deck">
          <div className="sbx-deck__file"><FileText size={20} /> Stridewise — Seed deck.pdf</div>
          <div className="sbx-deck__score">Overall <b>68</b>/100</div>
          <button className="sbx-action" data-spot="deck-open">Open analysis</button>
        </Tile>
        <Tile>
          <Eyebrow>Section scores</Eyebrow>
          <Meter value={68} label="Overall readiness" />
        </Tile>
      </div>
    );
  }

  return null;
}
