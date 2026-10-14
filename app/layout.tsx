import type { Metadata } from 'next';
// Atlas design system, copied verbatim from the client (tokens → base →
// components), then the sandbox's own layout styles, then the page reset.
import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/components.css';
import '@/styles/sandbox.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Atlas — Interactive Demo',
  description: 'Take a guided, interactive tour of the Atlas platform. No sign-up, sample data only.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* `atlas` scopes every design token; the demo lives entirely inside it. */}
      <body className="atlas">{children}</body>
    </html>
  );
}
