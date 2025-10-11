import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // React 19 support
  reactStrictMode: true,

  // TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Environment variables exposed to browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },

  // Experimental features
  experimental: {
    // Enable server actions
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
