'use client';

/**
 * Auth gate DISABLED for the standalone demo. This is a public, client-only
 * walkthrough with no session and no backend — nothing is ever gated, and no
 * one is sent to /login. Renders its children unconditionally.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
