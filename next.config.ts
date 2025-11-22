import type { NextConfig } from "next";

const nextConfig: NextConfig & { eslint?: { ignoreDuringBuilds?: boolean } } = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
