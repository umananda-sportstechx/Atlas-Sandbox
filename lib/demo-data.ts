/** Static sample data for the mock screens. No fetch, no backend — just props. */

export const SCOUT = {
  matches: [
    { name: 'Fanloop', sector: 'Fan Engagement', hq: 'Berlin, DE', raised: '€4.2m', round: 'Seed', why: ['Sector fit', 'Stage fit', 'Europe'] },
    { name: 'PitchIQ', sector: 'Performance Analytics', hq: 'London, UK', raised: '€2.1m', round: 'Seed', why: ['Sector fit', 'Traction'] },
    { name: 'CourtVision', sector: 'Broadcast & Media', hq: 'Madrid, ES', raised: '€6.8m', round: 'Series A', why: ['Europe', 'Momentum'] },
    { name: 'KitLabs', sector: 'Smart Equipment', hq: 'Amsterdam, NL', raised: '€1.4m', round: 'Pre-Seed', why: ['Sector fit'] },
  ],
  watchlistLists: [
    { name: 'Pitch-side shortlist', count: 8 },
    { name: 'Portfolio watch', count: 12 },
  ],
  board: [
    { name: 'Fanloop', stage: 'Reviewing' },
    { name: 'PitchIQ', stage: 'First look' },
    { name: 'CourtVision', stage: 'Meeting booked' },
  ],
  stages: ['First look', 'Reviewing', 'Meeting booked', 'Passed'],
  signals: [
    { name: 'StadiaOS', event: 'Raised €9m Series A', when: '2d ago' },
    { name: 'RefAI', event: 'Started raising', when: '4d ago' },
    { name: 'LoyalFan', event: 'New funding round opened', when: '1w ago' },
  ],
  deals: [
    { name: 'Stridewise', featured: true, round: 'Seed', raising: '€1.5m', valuation: '€8m pre', sector: 'Wearables', hq: 'Copenhagen, DK' },
    { name: 'GoalMetrics', featured: false, round: 'Pre-Seed', raising: '€600k', valuation: 'Undisclosed', sector: 'Analytics', hq: 'Lyon, FR' },
  ],
};

export const RAISE = {
  deck: {
    score: 71,
    sections: [
      { label: 'Problem', score: 84 },
      { label: 'Market size', score: 52 },
      { label: 'Traction', score: 77 },
      { label: 'Team', score: 80 },
      { label: 'Ask', score: 61 },
    ],
    topFix: 'Add a bottom-up market size — your TAM slide is top-down only, which investors discount.',
  },
  investors: [
    { name: 'Kestrel Field Ventures', focus: 'Seed · Europe', cheque: '€250k–1m', why: ['Backs sports tech', 'Stage fit', 'Lisbon + Berlin'] },
    { name: 'Northline Capital', focus: 'Seed–Series A', cheque: '€500k–2m', why: ['Fan engagement thesis'] },
    { name: 'Benchmark Sports', focus: 'Pre-Seed · Global', cheque: '€100k–500k', why: ['Pre-seed specialist'] },
  ],
  pipeline: {
    columns: ['Target', 'Contacted', 'Meeting', 'Committed'],
    cards: [
      { name: 'Kestrel Field Ventures', col: 'Target' },
      { name: 'Northline Capital', col: 'Contacted' },
      { name: 'Benchmark Sports', col: 'Meeting' },
    ],
  },
  market: { size: '€6.2b', growth: '+14% CAGR', deals: '320 deals / yr', competitors: ['Hudl', 'Sportradar', 'Genius Sports'] },
};

export const EXPLORE = {
  companies: [
    { name: 'Fanloop', sector: 'Fan Engagement', hq: 'Berlin, DE', raised: '€4.2m' },
    { name: 'Sportradar', sector: 'Data & Betting', hq: 'St. Gallen, CH', raised: '€1.2b' },
    { name: 'Hudl', sector: 'Performance', hq: 'Lincoln, US', raised: '$234m' },
    { name: 'CourtVision', sector: 'Broadcast', hq: 'Madrid, ES', raised: '€6.8m' },
    { name: 'KitLabs', sector: 'Equipment', hq: 'Amsterdam, NL', raised: '€1.4m' },
  ],
  funding: [
    { name: 'StadiaOS', round: 'Series A', amount: '€9.0m', when: 'Oct 2026' },
    { name: 'RefAI', round: 'Seed', amount: '€2.3m', when: 'Oct 2026' },
    { name: 'LoyalFan', round: 'Pre-Seed', amount: '€700k', when: 'Sep 2026' },
  ],
  acquisitions: [
    { buyer: 'Genius Sports', target: 'SecondSpectrum', amount: '$200m', when: '2021' },
    { buyer: 'Sportradar', target: 'Synergy Sports', amount: '$120m', when: '2021' },
  ],
  reports: [
    { title: 'State of Sports Tech 2026', tag: 'Flagship' },
    { title: 'Fan Engagement Landscape', tag: 'Sector' },
    { title: 'Q3 Funding Roundup', tag: 'Quarterly' },
  ],
  stats: { companies: '1,500+', investors: '2,000+', countries: '40+' },
};
