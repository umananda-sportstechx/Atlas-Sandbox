'use client';

/**
 * Entitlement gate DISABLED for the standalone demo. There are no tiers to
 * enforce and no account to read — every page renders directly. Renders its
 * children unconditionally.
 */
export function RouteGate({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
