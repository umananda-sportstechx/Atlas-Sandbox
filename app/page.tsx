'use client';

import { useEffect } from 'react';

/** The demo lives at /preview; the root just forwards there. */
export default function Home() {
  useEffect(() => {
    window.location.replace(`/preview${window.location.search || '?step=0'}`);
  }, []);
  return null;
}
