import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Automatic AVIF/WebP + responsive resizing for every remote content host.
    formats: ["image/avif", "image/webp"],
    // Primary content host is S3; admins may also paste image URLs from other
    // hosts (e.g. cdn.jumpshare.com) via the CMS, so allow any https host.
    // Content is admin-controlled, so this is acceptable.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  async redirects() {
    return [
      // Preserve legacy shared links (old app used /post/:id and /login).
      { source: "/post/:id", destination: "/reviews/:id", permanent: true },
      { source: "/login", destination: "/auth", permanent: true },
      { source: "/recommendations-page", destination: "/top-picks", permanent: true },
      { source: "/explore-genres", destination: "/genres", permanent: true },
    ];
  },
};

export default nextConfig;
