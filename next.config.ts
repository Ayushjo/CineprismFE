import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // IMPORTANT: our images are already hosted on Cloudinary / S3, which serve
    // optimized formats (f_auto/q_auto) over their own CDN. Routing them through
    // Vercel's Image Optimization on top of that is redundant AND burns the
    // Hobby plan's 5,000-transformation quota fast (each image × every breakpoint
    // × AVIF/WebP = many transformations, and SEO crawlers multiply it further).
    // So we disable Vercel optimization and let the source CDN do the work.
    // We still get <Image>'s width/height (no layout shift) + lazy loading.
    unoptimized: true,
    // Not required when unoptimized, but kept so re-enabling optimization later
    // (or using a Cloudinary loader) needs no host allow-listing changes.
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
