import type { Tour } from '@/lib/types';

/** Atlas Explore — the free tier tour: what you get before you pay. */
export const exploreTour: Tour = {
  tier: 'explore',
  intro: {
    title: 'See the whole market, free',
    body: 'Explore is the free tier. Browse every company, round, exit and report in sports tech — here’s what that looks like.',
  },
  steps: [
    { id: 'home', screen: 'home', title: 'Welcome to Atlas Explore', body: '1,500+ companies, 2,000+ investors, 40+ countries — all free to browse.', spotlight: 'explore-stats' },
    { id: 'search', screen: 'companies', title: 'Search the market', body: 'Find any company, sector or geography. Try searching for something.', prompt: { key: 'q', label: 'Search a company or market', placeholder: 'e.g. Fan Engagement', cta: 'Search' } },
    { id: 'companies', screen: 'companies', title: 'Every company, mapped', body: 'Each profile carries sector, HQ, funding and more — open one to dig in.', spotlight: 'company-row' },
    { id: 'funding', screen: 'funding', title: 'Track the money', body: 'Every round as it happens, filterable by stage, sector and geography.', spotlight: 'funding-row' },
    { id: 'acquisitions', screen: 'acquisitions', title: 'And the exits', body: 'Who bought whom, and for how much — the full M&A record.', spotlight: 'acq-row' },
    { id: 'reports', screen: 'reports', title: 'Go deep with reports', body: 'Flagship deep-dives and quarterly roundups, free to read.', spotlight: 'report-card' },
  ],
  finale: {
    title: 'That’s Explore',
    body: 'All of this is free. When you’re ready to raise or invest, Atlas Raise and Scout build on top of it.',
  },
};
