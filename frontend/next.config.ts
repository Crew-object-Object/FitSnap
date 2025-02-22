import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/a/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "h6q45r0c51.ufs.sh",
        port: "",
        pathname: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/a/**",
        search: "",
      },
    ],
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

export default withSerwist(nextConfig);
