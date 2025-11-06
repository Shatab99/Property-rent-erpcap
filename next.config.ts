import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static file caching for production
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  
  // Optimize static assets serving
  staticPageGenerationTimeout: 120,
  
  // Disable turbopack in production build if issues persist
  productionBrowserSourceMaps: false,
  
  // Ensure proper build output
  output: "standalone",
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allow all hosts
      },
      //allow for http also
      {
        protocol: "http",
        hostname: "**", // allow all hosts
      },
    ],
  },
  
  // Headers for proper static asset caching
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },
    ];
  },
  
  // async rewrites() {
  //   return [
  //     {
  //       source: '/server-apis/secure-path/:path*',
  //       destination: 'http://138.197.19.114:7008/api/v1/:path*',
  //     },
  //   ];
  // },
};

export default nextConfig;
