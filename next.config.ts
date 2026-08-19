import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  experimental: {
    serverActions: {
      allowedOrigins: [
        "r4x766qvq64fi6v4-3000.app.github.dev",
        "expert-zebra-r4x766qvq64fi6v4-3000.app.github.dev",
        "localhost:3000",
      ],
    },
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(self), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;