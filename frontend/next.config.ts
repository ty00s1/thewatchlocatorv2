import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8081" },
      { protocol: "http", hostname: "wordpress" },
    ],
  },
};

export default config;
