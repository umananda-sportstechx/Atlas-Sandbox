'use client';

import { useEffect } from 'react';

/**
 * The demo is the guided tour at /preview. The original marketing landing (which
 * fetched site content from a backend) is intentionally not used here — this is
 * a public, client-only sandbox, so the root just forwards into the tour.
 */
export default function Home() {
  useEffect(() => {
    window.location.replace('/preview');
  }, []);
  return null;
}
