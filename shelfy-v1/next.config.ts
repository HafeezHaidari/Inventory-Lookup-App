import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "m.media-amazon.com",
            }, {
                protocol: "https",
                hostname: "picsum.photos",
            },
            {
                protocol: "https",
                hostname: "example.com",
            },
            {
                protocol: "http",
                hostname: "res.cloudinary.com",
            }
        ],
    },
    eslint: {
        // Allow production builds to succeed even if ESLint errors are present.
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
