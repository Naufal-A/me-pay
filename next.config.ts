import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      // Nanti kalau kamu udah pakai Firebase Storage, tambahkan domainnya di sini juga
      // {
      //   protocol: 'https',
      //   hostname: 'firebasestorage.googleapis.com',
      // },
    ],
  },
};

export default nextConfig;
