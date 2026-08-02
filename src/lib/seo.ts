/*
 * SEO helpers — canonical/OG/Twitter metadata builders.
 * Replaces the backend's hand-rolled HTML-for-crawlers routes.
 */
import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://thecineprism.com";
export const SITE_NAME = "The Cinéprism";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;
export const TWITTER_HANDLE = "@TheCineprism";

export const SITE_DESCRIPTION =
  "Reviews, essays and quiet obsessions from a lifetime spent in the dark. Criticism as devotion — a journal of serious film.";

export function absoluteUrl(path = ""): string {
  if (!path) return SITE_URL;
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

type BuildMeta = {
  title: string;
  description?: string;
  path?: string; // canonical path
  image?: string | null;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  tags?: string[];
};

/** Build a full Metadata object with canonical + OG + Twitter cards. */
export function buildMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  image,
  type = "website",
  publishedTime,
  authors,
  tags,
}: BuildMeta): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ? (image.startsWith("http") ? image : absoluteUrl(image)) : DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
      ...(tags ? { tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title,
      description,
      images: [ogImage],
    },
  };
}
