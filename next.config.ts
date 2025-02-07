import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, 
  experimental: {
    appDir: true, 
    turboMode: false, 
  }, 
};

export default nextConfig;
