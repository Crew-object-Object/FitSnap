import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import { url } from "inspector";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["h6q45r0c51.ufs.sh"], // Add your image host here
  },
};

export default nextConfig;
