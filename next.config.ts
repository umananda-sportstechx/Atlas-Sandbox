import type { NextConfig } from 'next';

/**
 * Standalone sandbox demo. There is NO backend: the sandbox interceptor
 * (lib/sandbox/interceptor.ts) answers /api/* in the browser with mock data, so
 * the original /api proxy + BACKEND_URL requirement are removed on purpose.
 */
const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.trycloudflare.com'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
      { protocol: 'https', hostname: 'logo.clearbit.com' },
      { protocol: 'https', hostname: '*.apollo.io' },
    ],
  },
};

export default nextConfig;
