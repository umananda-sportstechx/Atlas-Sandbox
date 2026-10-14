/**
 * "The Warm-Up" for Atlas Raise: the welcome screen plus six steps over the
 * real app, played as the sample company Fanloop (see raise-routes.ts for its
 * ready-made workspace).
 *
 * Each `target` is a `data-tour` attribute on the real element; lists mark only
 * their first item. Paths come from lib/routes.ts so they can't drift.
 *
 * Left out until they launch: deck analysis and the AI co-pilot (chat is off
 * for the whole tour — the coach's guard blocks it with everything else).
 */
import { canonicalHrefOf as hrefOf } from '@/lib/routes';
import type { Tour } from '../tour-types';

const INVESTORS = hrefOf('investors');

export const raiseTour: Tour = {
	product: 'raise',
	intro: {
		title: 'Welcome to Raise',
		body: 'You’re Mira Hoffmann, founder of Fanloop, a fictional Berlin fan-engagement startup. You’re exploring Atlas Raise with sample data, and your round is already set up:',
		points: [
			{ label: 'Round', text: '€1.5m seed' },
			{ label: 'Committed', text: '€300k so far' },
			{ label: 'Sector', text: 'Fan Engagement' },
		],
	},
	steps: [
		{
			id: 'home',
			path: hrefOf('home'),
			target: 'raise-attention-card',
			title: 'Your raise at a glance',
			body: 'Home puts what needs you today up front, starting with follow-ups that slipped. Open the top card.',
			advance: { kind: 'click' },
		},
		{
			id: 'investors',
			path: hrefOf('recommended'),
			target: 'raise-top-investor',
			// The card's own Add / Not relevant actions would skip the profile step.
			only: `[data-tour="raise-top-investor"] a[href*="${INVESTORS}/"]`,
			title: 'Investors who fit Fanloop',
			body: 'Atlas matches investors on sector, stage and geography, and says why each one fits. Open your top match.',
			advance: { kind: 'path', pattern: `${INVESTORS}/:id` },
		},
		{
			id: 'investor-profile',
			path: `${INVESTORS}/:id`,
			target: 'raise-add-to-pipeline',
			title: 'Check the fit, then add',
			body: 'Stages, geography and recent deals show whether they back teams like yours. Add them to your watchlist.',
			advance: { kind: 'request', method: 'POST', pattern: '/api/raise/pipeline' },
		},
		{
			id: 'pipeline',
			path: hrefOf('pipeline'),
			target: 'raise-pipeline-card',
			highlights: ['raise-pipeline-contacted'],
			// Contacted is the only stage this step allows: the card drops only on
			// that column, and its details panel offers only that stage and Save.
			dropOn: '[data-tour="raise-pipeline-contacted"]',
			allow: ['[data-tour="raise-pipeline-stage"]', '[role="option"][data-value="contacted"]', '[data-tour="raise-pipeline-save"]'],
			pointerOnly: true,
			title: 'Move them to Contacted',
			body: 'Your watchlist tracks every investor, stage by stage. Drag the new card to Contacted, or open it, set the stage to Contacted and save.',
			advance: { kind: 'request', method: 'PATCH', pattern: '/api/raise/pipeline/:id', body: { stage: 'contacted' } },
			pause: 1200,
		},
		{
			id: 'market',
			path: hrefOf('my-market'),
			target: 'raise-market-size',
			title: 'Know your playing field',
			body: 'Market size, growth and funding in your space, built on SportsTechX data.',
			advance: { kind: 'next' },
		},
		{
			id: 'platform',
			path: hrefOf('home'),
			expandNav: true,
			highlights: ['nav-raise', 'nav-discover', 'nav-watchlists', 'nav-intelligence'],
			title: 'Explore the platform',
			body: 'Everything you just did lives in the sidebar:',
			points: [
				{ label: 'Raise', text: 'Find the investors and programs that fit your round.' },
				{ label: 'Discover', text: 'Find companies and investors worth your attention.' },
				{ label: 'Watchlists', text: 'Track every investor conversation, stage by stage.' },
				{ label: 'Intelligence', text: 'Research your market, competitors and funding trends.' },
			],
			cta: 'Finish Warm-Up',
			advance: { kind: 'next' },
		},
	],
	finale: {
		title: 'Warm-Up Complete. Ready to Play?',
		body: 'You’ve seen your raise at a glance, found investors who fit, built your investor pipeline and sized up your market.\n\nNow put Atlas Raise to work with your own company, live investor data and real conversations with investors.',
	},
};
