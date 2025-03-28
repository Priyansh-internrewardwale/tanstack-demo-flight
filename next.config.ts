import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  /*images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d1scqik6tlhrr8.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "d3olzcjcik4n3k.cloudfront.net",
      },
    ],
  },*/
};

export default nextConfig;
