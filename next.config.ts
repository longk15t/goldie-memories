import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev", // Allow custom R2 domains
      },
      {
        protocol: "https",
        hostname: "pub-*.r2.dev", // Common R2 public domains
      }
    ],
  },
};

export default nextConfig;
