import type { Tour } from '@/lib/types';

/** Atlas Raise — the founder tour. You play Fanloop, a startup mid-raise. */
export const raiseTour: Tour = {
  tier: 'raise',
  intro: {
    title: 'You’re Fanloop. Let’s raise.',
    body: 'You run Fanloop, a Berlin fan-engagement startup raising a €1.5m seed with €300k committed. A few quick moves and you’ve seen the whole playbook.',
  },
  steps: [
    { id: 'home', screen: 'home', title: 'Your raise at a glance', body: 'Home puts what needs you today up front — starting with follow-ups that slipped.', spotlight: 'attention-card' },
    { id: 'pitch', screen: 'home', title: 'Tell us what you’re building', body: 'Atlas tailors everything to your company. Give it a one-liner.', prompt: { key: 'pitch', label: 'In one line, what are you building?', placeholder: 'fan engagement for football clubs', cta: 'Continue' } },
    { id: 'deck', screen: 'deck', title: 'Your deck, scored 71/100', body: 'Atlas read your deck the way an investor would and scored every section.', spotlight: 'deck-open' },
    { id: 'top-fix', screen: 'deck', title: 'Start with the top fix', body: 'Recommendations are ranked by how much they lift your score. Fix this one first.', spotlight: 'top-fix' },
    { id: 'investors', screen: 'investors', title: 'Investors who fit', body: 'Matched on sector, stage and geography — with the reason each one fits.', spotlight: 'top-investor' },
    { id: 'pipeline', screen: 'pipeline', title: 'Work your pipeline', body: 'Track every investor stage by stage, from first contact to committed.', spotlight: 'pipeline-card' },
    { id: 'market', screen: 'market', title: 'Know your market', body: 'Market size, growth and benchmarks in your space, built on SportsTechX data.', spotlight: 'market-size' },
    { id: 'copilot', screen: 'chat', title: 'Ask your co-pilot', body: 'It knows your raise, your deck and your pipeline. Tap a suggestion to try it.', spotlight: 'chat-suggestion' },
  ],
  finale: {
    title: 'That’s the Raise playbook',
    body: 'With Atlas Raise this runs on your real deck, live investor data and your own conversations. Go raise for real.',
  },
};
