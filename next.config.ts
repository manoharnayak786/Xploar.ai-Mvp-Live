import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow deployment even if there are TypeScript or ESLint issues
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
