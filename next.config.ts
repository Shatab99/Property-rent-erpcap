import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable stable caching for dev & production
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000, // Keep pages active in memory
    pagesBufferLength: 5,
  },

  // Increase static page generation timeout for complex pages
  staticPageGenerationTimeout: 120,

  // Disable source maps in production (prevents code leaks)
  productionBrowserSourceMaps: false,

  // Generate output ready for Node/PM2/Nginx hosting
  output: "standalone",

  // Allow both HTTPS and HTTP remote images
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    // Optional: enforce optimization for performance
    formats: ["image/webp"],
  },

  // Custom headers for caching and security
  async headers() {
    return [
      // ✅ Static assets — long-term cache
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // ✅ Next assets — medium cache
      {
        source: "/_next/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },
      // ✅ Prevents stale HTML/JS issues (important for Brave)
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
      // ✅ Adds Content Security Policy (CSP)
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; connect-src 'self' https: http:; img-src 'self' data: blob: https: http:; style-src 'self' 'unsafe-inline'; font-src 'self' data:;",
          },
        ],
      },
      // ✅ Prevents MIME type sniffing & improves security
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Optional: Disable eval maps (safer for Brave)
  webpack(config, { dev, isServer }) {
    if (!dev) {
      config.devtool = false;
    }
    return config;
  },

  // Optional rewrites if needed
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
