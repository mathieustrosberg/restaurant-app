import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Configuration pour le build Docker
  outputFileTracingRoot: process.env.NODE_ENV === 'production' ? '/' : undefined,
};

export default nextConfig;
