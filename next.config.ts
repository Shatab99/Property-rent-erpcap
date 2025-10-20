import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
