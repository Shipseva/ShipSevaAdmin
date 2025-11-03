import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow production builds to succeed even if there are type or ESLint errors
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shipseva.s3.ap-south-1.amazonaws.com',
      },
    ],
  },
  // Reverse proxy configuration to proxy API requests through Next.js
  // This allows HTTPS frontend to communicate with HTTP backend
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://13.235.244.88';
    
    return [
      {
        source: '/api/backend/:path*',
        destination: `${backendUrl}/:path*`, // Proxy to your backend API
      },
    ];
  },
};

export default nextConfig;
