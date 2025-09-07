import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Optimize for better build performance
    optimizePackageImports: ['lucide-react', 'recharts'],
    // Enable Turbopack for faster builds
    turbo: {
      resolveAlias: {
        '@': '.',
      },
    },
  },
  // Fallback for non-Turbopack builds
  webpack: (config, { isServer }) => {
    if (!process.env.TURBOPACK) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': require('path').resolve(__dirname),
      };
    }
    return config;
  },
};

export default nextConfig;
