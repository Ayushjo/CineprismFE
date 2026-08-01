/*
 * Adapters: backend models → the shapes the cinematic design components expect.
 */
import type { ContentBlock, Post, RatingCategory, Review, TopPick } from "@/types/content";
import { slugify } from "@/lib/utils";

const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/** Clean, SEO-friendly review URL segment: `the-odyssey-<uuid>`. */
export function reviewSlug(post: Pick<Post, "id" | "title">): string {
  return `${slugify(post.title)}-${post.id}`;
}

/**
 * Resolve a `[slug]` param back to a post id. New links embed the full UUID;
 * the legacy `/post/:id` → `/reviews/:id` redirect passes a bare id — both work.
 */
export function idFromSlug(slug: string): string {
  const match = slug.match(UUID_RE);
  return match ? match[0] : slug;
}

function normalizeRatings(input: unknown): RatingCategory[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (r): r is RatingCategory =>
        !!r && typeof r === "object" && "category" in r && "score" in r
    )
    .map((r) => ({ category: String(r.category), score: Number(r.score) || 0 }));
}

/** Split plain-text `content` (blank-line separated) into paragraphs. */
export function contentToParagraphs(content: string): string[] {
  return (content ?? "")
    .split(/\n\s*\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function postToReview(post: Post): Review {
  const body = contentToParagraphs(post.content);
  const rating = normalizeRatings(post.ratingCategories);
  const ratingAvg = rating.length
    ? rating.reduce((a, c) => a + c.score, 0) / rating.length
    : 0;
  const firstLine = body[0] ?? "";

  return {
    slug: reviewSlug(post),
    id: post.id,
    title: post.title,
    year: post.year,
    genres: Array.isArray(post.genres) ? post.genres : [],
    director: post.directedBy,
    streaming: post.streamingAt,
    language: post.language,
    image: post.posterImageUrl || post.reviewPosterImageUrl || null,
    tagline: firstLine.length > 160 ? firstLine.slice(0, 157).trimEnd() + "…" : firstLine,
    body,
    rating,
    ratingAvg,
    stars: Math.round((ratingAvg / 20) * 2) / 2, // 0–5 in half steps
    viewCount: post.viewCount ?? 0,
    createdAt: post.createdAt,
  };
}

/** Flatten article blocks to plain text (for meta descriptions + JSON-LD). */
export function blocksToPlainText(blocks: ContentBlock[] | undefined): string {
  if (!blocks?.length) return "";
  return [...blocks]
    .sort((a, b) => a.order - b.order)
    .map((b) => {
      const c = (b.content ?? {}) as Record<string, unknown>;
      if (b.type === "PARAGRAPH" || b.type === "HEADING" || b.type === "QUOTE") {
        return typeof c.text === "string" ? c.text : "";
      }
      if (b.type === "LIST" && Array.isArray(c.items)) {
        return (c.items as string[]).join(". ");
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export function topPickToCard(pick: TopPick, index: number) {
  return {
    id: pick.id,
    rank: pick.rank ?? index + 1,
    title: pick.title,
    year: pick.year,
    genre: pick.genre,
    director: pick.director ?? null,
    synopsis: pick.synopsis ?? null,
    image: pick.posterImageUrl,
  };
}
