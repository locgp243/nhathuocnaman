import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    ignoreDuringBuilds: true, // tắt eslint khi build production
  },
  images: {
    domains: ['via.placeholder.com'], // 👈 thêm domain này
  },
};

export default nextConfig;
