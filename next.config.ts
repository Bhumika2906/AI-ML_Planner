import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/planner.html",
      },
    ];
  },
};

export default nextConfig;
