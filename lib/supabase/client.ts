'use client';

import { createBrowserClient } from '@supabase/ssr';

/*
 * Standalone demo: NO backend, NO env. These are inert placeholders so the
 * client constructs; there is never a session (anonymous), getSession() reads
 * localStorage only, and nothing authenticates — so no network reaches a real
 * project. The whole tour runs on mock data via lib/sandbox/interceptor.ts.
 */
const SUPABASE_URL = 'https://demo.invalid';
const SUPABASE_ANON_KEY = 'public-anon-demo-key';

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// Singleton for use in client-side hooks/lib
let _client: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowser() {
  if (!_client) {
    _client = createClient();
  }
  return _client;
}
