import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow production builds to succeed even if there are type or ESLint errors
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
