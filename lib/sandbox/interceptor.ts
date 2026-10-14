'use client';

/**
 * Request interceptor for the standalone demo. Installed once in the browser
 * (app/providers.tsx).
 *
 * THERE IS NO BACKEND. Every same-origin `/api/*` request — SWR fetcher,
 * apiRequest, chat/deck-analysis streams — is answered locally:
 *   - during a tour, the product's sandbox routes (raise-routes.ts /
 *     scout-routes.ts, then core-routes.ts) supply mock data;
 *   - anything they don't answer, and everything outside a tour (e.g. the
 *     chooser page, app-wide provider queries), gets an empty `json([])`.
 * Nothing ever reaches the network. Non-`/api` requests (Next assets, HMR,
 * fonts, images) pass straight through to the real fetch.
 *
 * In the `view` phase (after the tour) writes are refused with the upgrade
 * prompt, except the few read-only POSTs in VIEW_ALLOWED.
 *
 * After each `/api/*` request it handles, it dispatches PRACTICE_REQUEST_EVENT
 * (events.ts) so the tour coach can advance on "the user did X" steps.
 */
import { activeSandbox, practicePhase, readSandboxData, writeSandboxData } from './store';
import { isSandboxEligible } from './eligibility';
import { coreSandboxRoutes } from './core-routes';
import { raiseSandboxRoutes } from './raise-routes';
import { scoutSandboxRoutes } from './scout-routes';
import { matchPath } from './match-path';
import { PRACTICE_REQUEST_EVENT, type PracticeRequestDetail } from './events';
import { gated, json, type SandboxProduct, type SandboxRoute } from './types';

declare global {
	interface Window { __stxSandboxFetch?: boolean }
}

const ROUTES: Record<SandboxProduct, SandboxRoute[]> = {
	raise: [...raiseSandboxRoutes, ...coreSandboxRoutes],
	scout: [...scoutSandboxRoutes, ...coreSandboxRoutes],
};

const PRODUCT_NAME = { raise: 'Raise', scout: 'Scout' } as const;

/** Non-GET requests that still go through in view-only practice: they read, not write. */
const VIEW_ALLOWED: Array<[method: string, pattern: string]> = [
	['POST', '/api/deck-analysis/:id/stream'],
];
/** Session plumbing (sign-in bookkeeping) is never blocked. */
const AUTH_PREFIX = '/api/auth/';

const READ_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const STORAGE_UPLOAD = /\/storage\/v1\/object\/(?!sign\/|public\/|authenticated\/)/;

function isViewBlocked(method: string, pathname: string): boolean {
	if (READ_METHODS.has(method) || pathname.startsWith(AUTH_PREFIX)) return false;
	return !VIEW_ALLOWED.some(([m, p]) => m === method && matchPath(p, pathname));
}

function notify(method: string, path: string) {
	window.dispatchEvent(new CustomEvent<PracticeRequestDetail>(PRACTICE_REQUEST_EVENT, { detail: { method, path } }));
}

function parseBody(init?: RequestInit): unknown {
	if (typeof init?.body !== 'string') return undefined;
	try { return JSON.parse(init.body); } catch { return init.body; }
}

export function installSandboxInterceptor() {
	if (typeof window === 'undefined' || window.__stxSandboxFetch) return;
	window.__stxSandboxFetch = true;
	const realFetch = window.fetch.bind(window);

	// No backend: an unhandled /api/* is answered with an empty list, never the
	// network. `[]` rather than `{}` because nearly every unmocked GET this app
	// makes (watchlists, api-keys, notifications, the feature matrix, catalogs…)
	// is a list, so an empty list degrades the most of them gracefully to
	// "nothing here".
	const emptyApi = () => Promise.resolve(json([]));

	/** Offer the request to the product's routes; undefined = nobody answered. */
	async function route(product: SandboxProduct, method: string, url: URL, init?: RequestInit): Promise<Response | undefined> {
		for (const [m, pattern, handler] of ROUTES[product]) {
			if (m !== method) continue;
			const params = matchPath(pattern, url.pathname);
			if (!params) continue;
			const state = readSandboxData(product);
			const out = await handler({
				method, url, params, body: parseBody(init), product, state,
				save: () => writeSandboxData(product, state),
				passthrough: () => emptyApi(),
			});
			if (out === undefined) return undefined; // handler declined → empty
			return out instanceof Response ? out : json(out);
		}
		return undefined;
	}

	window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
		const raw = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
		let url: URL;
		try { url = new URL(raw, window.location.origin); } catch { return realFetch(input, init); }
		const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
		const isApi = url.origin === window.location.origin && url.pathname.startsWith('/api/');

		// File uploads to Supabase Storage never leave the browser: report success
		// so the flow reaches its API step (which practice then answers).
		if (STORAGE_UPLOAD.test(url.pathname) && (method === 'POST' || method === 'PUT')) {
			const key = url.pathname.split('/storage/v1/object/')[1] ?? 'sandbox';
			return json({ Key: key, Id: 'sandbox', path: key.split('/').slice(1).join('/') });
		}

		// Everything that is not a same-origin /api call (Next assets, HMR, fonts,
		// images, third-party) goes straight to the real fetch.
		if (!isApi) return realFetch(input, init);

		const product = activeSandbox();
		// Outside a tour (chooser page, app-wide provider queries): no backend to
		// call, so answer every /api with an empty list instead of a 404.
		if (!product || !isSandboxEligible()) {
			const res = await emptyApi();
			notify(method, url.pathname);
			return res;
		}

		let res: Response;
		if (practicePhase() === 'view' && isViewBlocked(method, url.pathname)) {
			res = gated(product, `Practice mode is view-only — get Atlas ${PRODUCT_NAME[product]} to do this for real.`);
		} else {
			const local = await route(product, method, url, init);
			// A write no practice route answers would change a REAL account; practice
			// never writes for real, so unanswered writes get the upgrade prompt too.
			res = local ?? (method !== 'GET' && isViewBlocked(method, url.pathname)
				? gated(product, `That's not part of the practice run — get Atlas ${PRODUCT_NAME[product]} to do this for real.`)
				: await emptyApi());
		}
		notify(method, url.pathname);
		return res;
	};
}
