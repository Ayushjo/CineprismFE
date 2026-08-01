import type { MetadataRoute } from "next";
import { getAllPosts, getArticles } from "@/lib/api";
import { reviewSlug } from "@/lib/adapters";
import { SITE_URL } from "@/lib/seo";
import { GENRES } from "@/lib/genres";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, articles] = await Promise.all([
    getAllPosts().catch(() => []),
    getArticles().catch(() => []),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/reviews`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/articles`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/top-picks`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/trending`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/genres`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/newsletter`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const genreRoutes: MetadataRoute.Sitemap = GENRES.map((g) => ({
    url: `${SITE_URL}/genres/${g.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const reviewRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/reviews/${reviewSlug(p)}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles
    .filter((a) => a.slug && a.published !== false)
    .map((a) => ({
      url: `${SITE_URL}/articles/${a.slug}`,
      lastModified: a.updatedAt ? new Date(a.updatedAt) : now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [...staticRoutes, ...genreRoutes, ...reviewRoutes, ...articleRoutes];
}
