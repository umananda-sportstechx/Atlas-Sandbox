import type { Tour } from '@/lib/types';

/** Atlas Scout — the investor tour. You play Jordan Ellis of Kestrel Field Ventures. */
export const scoutTour: Tour = {
  tier: 'scout',
  intro: {
    title: 'Welcome to your scouting desk',
    body: 'You’re Jordan Ellis, a partner backing seed-to-Series-A sports tech across Europe. Let’s go find your next deal.',
  },
  steps: [
    { id: 'home', screen: 'home', title: 'Fresh matches this week', body: 'Atlas scores new companies against your thesis. This is the first thing you see each morning.', spotlight: 'matches-card' },
    { id: 'thesis', screen: 'recommended', nav: 'recommended', title: 'Tune your thesis', body: 'Matches follow your thesis. Tell Atlas a sector you’d back and watch the list retarget.', prompt: { key: 'sector', label: 'Name a sector you’d back', placeholder: 'e.g. Fan Engagement', cta: 'See matches' } },
    { id: 'why', screen: 'recommended', nav: 'recommended', title: 'Scored against your thesis', body: 'Every company shows exactly which parts of your thesis it hits — no black box.', spotlight: 'why-match' },
    { id: 'save', screen: 'company', nav: 'recommended', title: 'Keep them on your radar', body: 'Open a company and save it to a watchlist in one click.', spotlight: 'save-watchlist' },
    { id: 'watchlists', screen: 'watchlists', title: 'Your watchlists', body: 'Everything you track, grouped your way.', spotlight: 'open-watchlist' },
    { id: 'board', screen: 'board', nav: 'watchlists', title: 'Move it up the pitch', body: 'Switch a watchlist to Board and line companies up by deal stage — a first look becomes a first meeting.', spotlight: 'board-stage' },
    { id: 'signals', screen: 'signals', title: 'Signals from the market', body: 'Fresh funding rounds and companies starting to raise — spot momentum before the crowd.' },
    { id: 'dealflow', screen: 'deal-flow', title: 'Live raises, verified', body: 'Deal Flow lists companies raising right now, checked by SportsTechX.', spotlight: 'featured-deal' },
    { id: 'deck', screen: 'deck', title: 'Screen a deck in minutes', body: 'Atlas reads a pitch deck and scores it section by section, so you triage faster.', spotlight: 'deck-open' },
  ],
  finale: {
    title: 'That’s the Scout play',
    body: 'Matches, watchlists, signals, deal flow and deck screening — all on your own thesis, with real intros to founders in Atlas Scout.',
  },
};
