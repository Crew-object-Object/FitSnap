import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = {
  images: {
    domains: ["h6q45r0c51.ufs.sh"],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        "localhost:3000",
        "fitsnap-hackx.vercel.app",
        "solid-memory-qwxrp6qwrw4c6wqr-3000.app.github.dev",
      ],
    },
  },
};

export default nextConfig;
