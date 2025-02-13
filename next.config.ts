import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Add the alias to the Webpack configuration
    config.resolve.alias["@"] = __dirname + "/src";
    return config;
  },
};

export default nextConfig;
