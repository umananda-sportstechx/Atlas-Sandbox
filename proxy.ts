import { NextResponse, type NextRequest } from 'next/server';

/**
 * Auth middleware disabled for the standalone demo — there is no session and no
 * backend. The original supabase `updateSession` gate is gone; an empty matcher
 * means this never runs, so every route (the /preview tour) is public.
 */
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = { matcher: [] };
