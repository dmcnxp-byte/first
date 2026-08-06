import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All content images are served through Sanity's image CDN — see
    // DOC/FRONTEND_ARCHITECTURE.md § 4.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
