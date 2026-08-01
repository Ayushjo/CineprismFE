import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Automatic AVIF/WebP + responsive resizing for every remote content host.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Real content hosts
      { protocol: "https", hostname: "thecineprismimages.s3.ap-south-1.amazonaws.com" },
      { protocol: "https", hostname: "*.s3.ap-south-1.amazonaws.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "image.tmdb.org" },
      // Design placeholders (safe to keep; used until every screen is wired to real data)
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
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
