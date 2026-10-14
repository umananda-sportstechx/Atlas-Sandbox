/**
 * "The Warm-Up" — the Atlas Scout tour: the welcome screen plus nine steps,
 * ten numbered in all.
 *
 * The visitor plays Jordan Ellis, partner at the fictional Kestrel Field
 * Ventures, whose ready-made workspace and thesis come from scout-routes.ts.
 * Every step is pinned to the same sample objects — Fanfold (the top thesis
 * match), the "Pitch-side shortlist" and the featured Stridewise deal — so the
 * paths are concrete and Back can always reopen the right page. Each `target`
 * is a `data-tour` attribute on the real page.
 *
 * Request patterns match what the pages actually send:
 *   - save to watchlist: SaveToWatchlist → addToWatchlist()
 *     (components/features/watchlists/use-company-watchlists.ts)
 * The board's stage change sends no request (it is kept in this browser by
 * components/scout/watchlist-board.tsx), so that step advances on the click of
 * the one stage it allows. Request introduction is simulated: the click never
 * reaches the page, and the next step shows what would have happened.
 *
 * Left out until they launch: Signals and the Deck Screener. Chat is off for
 * the whole tour (the coach's guard blocks it with everything else).
 */
import type { Tour } from '../tour-types';
import { SANDBOX_FANFOLD_ID, SANDBOX_FEATURED_DEAL_ID } from '../scout-routes';
import { SHORTLIST_ID } from '../watchlist-routes';

const FANFOLD = `/companies/${SANDBOX_FANFOLD_ID}`;
const SHORTLIST = `/watchlists/${SHORTLIST_ID}`;
const FEATURED_DEAL = `/deal-flow/${SANDBOX_FEATURED_DEAL_ID}`;

export const scoutTour: Tour = {
	product: 'scout',
	intro: {
		title: 'Welcome to Scout',
		body: 'You’re Jordan Ellis, partner at Kestrel Field Ventures, a fictional fund. You’re exploring Atlas Scout with sample data, and your investment thesis is already set:',
		points: [
			{ label: 'Sectors', text: 'Fan Engagement, Tracking & Analytics, Recovery & Injury Prevention' },
			{ label: 'Stage', text: 'Seed to Series A' },
			{ label: 'Geography', text: 'Europe' },
			{ label: 'Cheque', text: '€250k to €1.5m' },
		],
	},
	steps: [
		{
			id: 'home-matches',
			path: '/home',
			target: 'scout-matches-card',
			title: 'Fresh matches',
			body: 'Atlas finds companies matching your investment thesis. Let’s see who’s made the shortlist.',
			advance: { kind: 'path', pattern: '/recommended' },
		},
		{
			id: 'recommended',
			path: '/recommended',
			target: 'scout-open-company',
			title: 'Evaluate a match',
			body: 'See why a company matches your investment thesis, from sector and geography to stage and investment criteria.',
			advance: { kind: 'path', pattern: FANFOLD },
		},
		{
			id: 'company-save',
			path: FANFOLD,
			target: 'company-save-watchlist',
			// The menu the button opens: only the predefined shortlist can be picked.
			allow: [`[data-watchlist-id="${SHORTLIST_ID}"]`],
			title: 'Add to watchlist',
			body: 'Found something interesting? Save it to a watchlist so you can keep track of the company.',
			advance: { kind: 'request', method: 'POST', pattern: `/api/user-watchlists/${SHORTLIST_ID}/companies/:id` },
			pause: 900,
		},
		{
			id: 'watchlist-open',
			path: '/watchlists',
			target: 'watchlist-open',
			title: 'Explore watchlists',
			body: 'All the companies you’re tracking live in your watchlists. Open yours to see the companies you’ve saved.',
			advance: { kind: 'path', pattern: SHORTLIST },
		},
		{
			id: 'watchlist-board',
			path: SHORTLIST,
			target: 'scout-board-toggle',
			title: 'Manage your pipeline',
			body: 'Switch to Board view to organise your opportunities by deal stage.',
			advance: { kind: 'click', on: '[data-tour="scout-board-toggle"] [data-key="board"]' },
		},
		{
			id: 'watchlist-stage',
			path: SHORTLIST,
			continues: true,
			// Two ways, both locked to Reviewing: drag the card onto that column
			// only, or pick it in the card's stage menu (a portal; its only allowed
			// option). The card itself takes no clicks, so its name link stays dead.
			target: 'scout-board-card',
			only: '[data-tour="scout-board-stage"]',
			dragFrom: '[data-tour="scout-board-card"]',
			highlights: ['scout-board-reviewing'],
			dropOn: '[data-tour="scout-board-reviewing"]',
			allow: ['[role="option"][data-value="Reviewing"]'],
			// Arrow keys on the menu could pick any stage — clicks only.
			pointerOnly: true,
			title: 'Manage your pipeline',
			body: 'Move Fanfold from Identified to Reviewing to track your progress. Drag the card, or use its stage menu.',
			advance: { kind: 'click', on: '[role="option"][data-value="Reviewing"]' },
			// Let Fanfold land in the Reviewing column before Deal Flow opens.
			pause: 1400,
		},
		{
			id: 'deal-flow',
			path: '/deal-flow',
			target: 'scout-featured-deal',
			title: 'Discover live deals',
			body: 'Explore curated fundraising opportunities, with key round details and information reviewed by SportsTechX.',
			advance: { kind: 'path', pattern: FEATURED_DEAL },
		},
		{
			id: 'request-intro',
			path: FEATURED_DEAL,
			target: 'scout-request-intro',
			title: 'Explore an opportunity',
			body: 'Interested in an opportunity? Atlas Scout helps you request a warm introduction to the founders.',
			advance: { kind: 'click', simulate: true },
		},
		{
			id: 'intro-sent',
			path: FEATURED_DEAL,
			title: 'Request an introduction',
			body: 'This is a simulation: nothing was sent. Here’s what happens in Atlas Scout.',
			confirm: {
				title: 'Your next deal starts here.',
				body: 'With Atlas Scout, you can request warm introductions to founders raising capital. SportsTechX coordinates the connection.',
			},
			cta: 'Continue Warm-Up',
			advance: { kind: 'next' },
		},
		{
			id: 'platform',
			path: '/home',
			expandNav: true,
			highlights: ['nav-discover', 'nav-watchlists', 'nav-deal-flow', 'nav-intelligence'],
			title: 'Explore the platform',
			body: 'Everything you just did lives in the sidebar:',
			points: [
				{ label: 'Discover', text: 'Find companies matching your investment thesis.' },
				{ label: 'Watchlists', text: 'Track companies and manage your investment pipeline.' },
				{ label: 'Deal Flow', text: 'Explore active fundraising opportunities.' },
				{ label: 'Intelligence', text: 'Research the market, companies and investment trends.' },
			],
			cta: 'Finish Warm-Up',
			advance: { kind: 'next' },
		},
	],
	finale: {
		title: 'Warm-Up Complete. Ready to Play?',
		body: 'You’ve discovered companies matching your thesis, built a watchlist, managed your pipeline and explored live fundraising opportunities.\n\nNow put Atlas Scout to work with your own investment thesis, real companies and access to founders.',
	},
};
