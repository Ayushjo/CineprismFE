/*
 * Helpers for TMDB-sourced trending data.
 */
import type { Post } from "@/types/content";
import { reviewSlug } from "@/lib/adapters";

export type TrendingItem = {
  id: number;
  tmdbId: number;
  title: string;
  year: number | null;
  poster: string | null;
  backdrop: string | null;
  overview: string;
  rating: number; // vote_average 0–10
  voteCount: number;
  popularity: number;
  rank: number;
  genres: string[];
  releaseDate: string | null;
  reviewSlug: string | null; // set if we've reviewed it
};

export type NewsItem = {
  id: number;
  title: string;
  description: string;
  url: string;
  source: string;
  author: string | null;
  publishedAt: string;
  image: string | null;
  category: string;
};

const TMDB_IMG = "https://image.tmdb.org/t/p";
export function tmdbImage(path: string | null | undefined, size = "w500"): string | null {
  if (!path) return null;
  return `${TMDB_IMG}/${size}${path.startsWith("/") ? "" : "/"}${path}`;
}

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
  99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
  27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance",
  878: "Sci-Fi", 10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

function parseGenreIds(raw: unknown): string[] {
  if (typeof raw !== "string") return [];
  const ids = raw.match(/\d+/g)?.map(Number) ?? [];
  return ids.map((id) => GENRE_MAP[id]).filter(Boolean).slice(0, 3);
}

/** Normalize a title for fuzzy matching against our reviews. */
function normTitle(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toTrendingItem(raw: any, reviewIndex: Map<string, Post>): TrendingItem {
  const title = String(raw.title ?? "");
  const match = reviewIndex.get(normTitle(title));
  const releaseDate = raw.release_date ? String(raw.release_date) : null;
  return {
    id: Number(raw.id),
    tmdbId: Number(raw.tmdb_id),
    title,
    year: releaseDate ? new Date(releaseDate).getFullYear() || null : null,
    poster: tmdbImage(raw.poster_path, "w500"),
    backdrop: tmdbImage(raw.backdrop_path, "w1280"),
    overview: String(raw.overview ?? ""),
    rating: Number(raw.vote_average) || 0,
    voteCount: Number(raw.vote_count) || 0,
    popularity: Number(raw.popularity_score) || 0,
    rank: Number(raw.trending_rank) || 0,
    genres: parseGenreIds(raw.genre_ids),
    releaseDate,
    reviewSlug: match ? reviewSlug(match) : null,
  };
}

export function toNewsItem(raw: any): NewsItem {
  return {
    id: Number(raw.id),
    title: String(raw.title ?? ""),
    description: String(raw.description ?? ""),
    url: String(raw.url ?? "#"),
    source: String(raw.source_name ?? ""),
    author: raw.author ? String(raw.author) : null,
    publishedAt: String(raw.published_at ?? ""),
    image: raw.image_url ? String(raw.image_url) : null,
    category: String(raw.category ?? "General"),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Build a title→Post index for review cross-referencing. */
export function buildReviewIndex(posts: Post[]): Map<string, Post> {
  const map = new Map<string, Post>();
  for (const p of posts) map.set(normTitle(p.title), p);
  return map;
}

/** "In Theatres" / "Coming Soon" / "Released" signal from a release date. */
export function releaseSignal(releaseDate: string | null): string {
  if (!releaseDate) return "";
  const d = new Date(releaseDate);
  if (Number.isNaN(d.getTime())) return "";
  const now = Date.now();
  const days = (now - d.getTime()) / 86400000;
  if (days < 0) return "Coming Soon";
  if (days < 60) return "In Theatres";
  return `Released ${d.getFullYear()}`;
}
