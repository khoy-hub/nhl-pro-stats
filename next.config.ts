import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "assets.nhle.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "flagcdn.com",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;