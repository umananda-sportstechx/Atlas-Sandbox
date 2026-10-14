import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  // Standalone demo: inert placeholders, no env, no real backend. See client.ts.
  return createServerClient(
    'https://demo.invalid',
    'public-anon-demo-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component — cookie writes are handled by middleware
          }
        },
      },
    },
  );
}
