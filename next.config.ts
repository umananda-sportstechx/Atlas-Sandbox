import type { NextConfig } from 'next';

/**
 * Static single-page product demo. No backend, no server routes — it exports to
 * plain HTML/JS and is hosted like the landing repos (push to main → deploy).
 */
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
