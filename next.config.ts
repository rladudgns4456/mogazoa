/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,

  /* svgr 설정 */
  webpack(config) {

    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });


     return config;
  },
};

export default nextConfig;
