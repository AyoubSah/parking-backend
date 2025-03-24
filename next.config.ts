import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Add the alias to the Webpack configuration
    config.resolve.alias["@"] = __dirname + "/src";
    return config;
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

};



export default nextConfig;
