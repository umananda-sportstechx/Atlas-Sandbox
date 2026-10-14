'use client';

import { useEffect } from 'react';

/** The demo lives at /sandbox; the root just forwards there. */
export default function Home() {
  useEffect(() => {
    window.location.replace(`/sandbox${window.location.search || '?step=0'}`);
  }, []);
  return null;
}
