'use client';

import { Check, FileText, Send, Sparkles } from 'lucide-react';
import type { ScreenProps } from '@/lib/types';
import { RAISE } from '@/lib/demo-data';
import { Chip, Eyebrow, Logo, Meter, PageHead, Tile } from './ui';

const SUGGESTIONS = ['Which investors should I contact first?', 'Draft an intro email to Kestrel', 'How does my deck compare to peers?'];

/** Atlas Raise — the founder workspace, mocked. */
export function ScreenRaise({ screen, inputs }: ScreenProps) {
  const pitch = inputs.pitch?.trim();

  if (screen === 'home') {
    return (
      <div className="atlas-screen">
        <PageHead title="Fanloop" sub={pitch ? pitch : 'Seed raise · €1.5m target · €300k committed'} />
        <div className="sbx-grid3">
          <Tile><Eyebrow>Deck score</Eyebrow><div className="sbx-stat">71</div><span className="sbx-stat__note">/ 100</span></Tile>
          <Tile><Eyebrow>Matched investors</Eyebrow><div className="sbx-stat">38</div><span className="sbx-stat__note">ranked by fit</span></Tile>
          <Tile><Eyebrow>Committed</Eyebrow><div className="sbx-stat">20%</div><span className="sbx-stat__note">€300k of €1.5m</span></Tile>
        </div>
        <Eyebrow>What needs your attention</Eyebrow>
        <Tile spot="attention-card" className="sbx-attention">
          <div>
            <div className="sbx-attention__title">2 follow-ups are overdue</div>
            <div className="sbx-attention__body">Northline Capital asked for your metrics 5 days ago.</div>
          </div>
          <span className="sbx-attention__cta">Open →</span>
        </Tile>
      </div>
    );
  }

  if (screen === 'deck') {
    return (
      <div className="atlas-screen">
        <PageHead title="Deck analysis" sub="Scored the way an investor reads it" />
        <Tile className="sbx-deck">
          <div className="sbx-deck__file"><FileText size={20} /> Fanloop — Seed deck.pdf</div>
          <div className="sbx-deck__score">Overall <b>{RAISE.deck.score}</b>/100</div>
          <button className="sbx-action" data-spot="deck-open">Open full analysis</button>
        </Tile>
        <div className="sbx-grid2">
          <Tile>
            <Eyebrow>Section scores</Eyebrow>
            {RAISE.deck.sections.map((s) => (
              <div key={s.label} className="sbx-secrow"><span>{s.label}</span><Meter value={s.score} /></div>
            ))}
          </Tile>
          <Tile spot="top-fix" accent>
            <Eyebrow>Top fix</Eyebrow>
            <p className="sbx-para">{RAISE.deck.topFix}</p>
            <Chip tone="accent"><Sparkles size={11} /> +9 to score</Chip>
          </Tile>
        </div>
      </div>
    );
  }

  if (screen === 'investors') {
    return (
      <div className="atlas-screen">
        <PageHead title="Recommended investors" sub={pitch ? `Matched to “${pitch}”` : 'Matched on sector, stage and geography'} />
        <div className="sbx-cards">
          {RAISE.investors.map((inv, i) => (
            <Tile key={inv.name} className="sbx-cocard" spot={i === 0 ? 'top-investor' : undefined}>
              <div className="sbx-cocard__top">
                <Logo name={inv.name} />
                <div>
                  <div className="sbx-cocard__name">{inv.name}</div>
                  <div className="sbx-cocard__meta">{inv.focus} · {inv.cheque}</div>
                </div>
              </div>
              <div className="sbx-why">
                <Eyebrow>Why it fits</Eyebrow>
                <div className="sbx-why__chips">{inv.why.map((w) => <Chip key={w} tone="ok"><Check size={11} /> {w}</Chip>)}</div>
              </div>
            </Tile>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'pipeline') {
    return (
      <div className="atlas-screen">
        <PageHead title="Your pipeline" sub="Every investor, stage by stage" />
        <div className="sbx-board">
          {RAISE.pipeline.columns.map((col) => (
            <div key={col} className="sbx-board__col">
              <div className="sbx-board__head">{col}</div>
              {RAISE.pipeline.cards.filter((c) => c.col === col).map((c) => (
                <div key={c.name} className="sbx-board__card" data-spot={c.name === 'Kestrel Field Ventures' ? 'pipeline-card' : undefined}>
                  <div className="sbx-board__co"><Logo name={c.name} size={26} /> {c.name}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (screen === 'market') {
    return (
      <div className="atlas-screen">
        <PageHead title="My market" sub="Your playing field, built on SportsTechX data" />
        <div className="sbx-grid3">
          <Tile spot="market-size" accent><Eyebrow>Market size</Eyebrow><div className="sbx-stat">{RAISE.market.size}</div><span className="sbx-stat__note">{RAISE.market.growth}</span></Tile>
          <Tile><Eyebrow>Deal volume</Eyebrow><div className="sbx-stat sbx-stat--sm">{RAISE.market.deals}</div></Tile>
          <Tile><Eyebrow>Benchmarks</Eyebrow><div className="sbx-why__chips">{RAISE.market.competitors.map((c) => <Chip key={c}>{c}</Chip>)}</div></Tile>
        </div>
      </div>
    );
  }

  if (screen === 'chat') {
    return (
      <div className="atlas-screen">
        <PageHead title="Co-pilot" sub="It knows your raise, your deck and your pipeline" />
        <Tile className="sbx-chat">
          <div className="sbx-chat__msg">How can I help with your raise today?</div>
          <div className="sbx-chat__chips">
            {SUGGESTIONS.map((s, i) => (
              <button key={s} className="sbx-chip sbx-chip--btn" data-spot={i === 0 ? 'chat-suggestion' : undefined}>{s}</button>
            ))}
          </div>
          <div className="sbx-chat__composer"><span>Ask anything…</span><Send size={15} /></div>
        </Tile>
      </div>
    );
  }

  return null;
}
