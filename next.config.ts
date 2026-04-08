// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true, // keep it if using new React compiler
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'], // <- THIS
  },
};

export default nextConfig;