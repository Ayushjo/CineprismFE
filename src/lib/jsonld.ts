/*
 * Structured-data (schema.org) builders for rich results.
 */
import type { Article, Review } from "@/types/content";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

const publisher = {
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
};

// Google-sanctioned paywall/gated-content markup: tells search engines the
// content behind `.paywalled-content` requires sign-in (so full-content
// indexing isn't treated as cloaking).
const paywall = {
  isAccessibleForFree: false,
  hasPart: {
    "@type": "WebPageElement",
    isAccessibleForFree: false,
    cssSelector: ".paywalled-content",
  },
};

/** schema.org Review nested over a Movie, with our rating. */
export function reviewJsonLd(review: Review, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    url: absoluteUrl(path),
    datePublished: review.createdAt,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher,
    itemReviewed: {
      "@type": "Movie",
      name: review.title,
      ...(review.director ? { director: { "@type": "Person", name: review.director } } : {}),
      ...(review.image ? { image: review.image } : {}),
      ...(review.year ? { dateCreated: String(review.year) } : {}),
      genre: review.genres,
    },
    ...(review.ratingAvg > 0
      ? {
          reviewRating: {
            "@type": "Rating",
            ratingValue: Math.round(review.ratingAvg),
            bestRating: 100,
            worstRating: 0,
          },
        }
      : {}),
    ...(review.tagline ? { reviewBody: review.tagline } : {}),
    ...paywall,
  };
}

/** schema.org Article for editorial pieces (top-notch article SEO). */
export function articleJsonLd(article: Article, path: string, plainText: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    headline: article.title,
    description: article.shortDescription,
    image: article.mainImageUrl ? [article.mainImageUrl] : undefined,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    author: { "@type": "Person", name: article.author || SITE_NAME },
    publisher,
    articleBody: plainText || undefined,
    wordCount: plainText ? plainText.trim().split(/\s+/).length : undefined,
    ...paywall,
  };
}

/** WebSite entity with Sitelinks Search box for the homepage. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/reviews?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
