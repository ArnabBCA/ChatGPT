import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  //disabel srict mode
  reactStrictMode: false,
  images: {
    remotePatterns: [new URL("https://ucarecdn.com/**")],
  },
};

export default nextConfig;
