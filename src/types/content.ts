/*
 * Types mirroring the Express/Prisma backend responses.
 * Source of truth: testingcineprismbackend/prisma/schema.prisma
 */

export interface RatingCategory {
  category: string;
  score: number; // 0–100
}

export interface PostImage {
  id: string;
  imageUrl: string;
}

/** Backend `Post` (a review). */
export interface Post {
  id: string;
  shortId?: string | null; // short-link code (e.g. /s/<shortId>)
  title: string;
  content: string; // plain text, paragraphs separated by blank lines
  genres: string[];
  year: number;
  directedBy: string;
  streamingAt: string;
  language: string;
  posterImageUrl?: string | null;
  reviewPosterImageUrl?: string | null;
  /** Set when streamingAt came from TMDB/JustWatch (needs attribution). */
  streamingSyncedAt?: string | null;
  ratingCategories: RatingCategory[];
  viewCount: number;
  relatedPostIds?: string[];
  images?: PostImage[]; // gallery (poster/backdrop already filtered out by backend)
  createdAt: string;
  updatedAt?: string;
  comments?: unknown[];
  likes?: unknown[];
  _count?: { comments?: number; likes?: number };
}

/** UI shape consumed by the cinematic design components. */
export interface Review {
  slug: string;
  id: string;
  shortId?: string | null; // short-link code (e.g. /s/<shortId>)
  title: string;
  year: number;
  genres: string[];
  director: string;
  streaming: string;
  language: string;
  /** True when `streaming` comes from JustWatch (via TMDB) — show the credit. */
  streamingFromJustWatch: boolean;
  /** Vertical/main poster (posterImageUrl) — use for 3:4 displays. */
  poster?: string | null;
  /** Horizontal backdrop (reviewPosterImageUrl) — use for 16:9 / 2.35:1 displays. */
  backdrop?: string | null;
  /** Best image for OG/meta (backdrop ‖ poster) — landscape first for link previews. */
  image?: string | null;
  /** Gallery stills. */
  gallery: string[];
  tagline?: string;
  body: string[];
  rating: RatingCategory[];
  ratingAvg: number; // 0–100
  stars: number; // 0–5 derived
  viewCount: number;
  createdAt: string;
}

/** Article content blocks (BlockType enum on the backend). */
export type BlockType = "PARAGRAPH" | "HEADING" | "IMAGE" | "LIST" | "QUOTE" | "DIVIDER";

export interface ContentBlock {
  id: string;
  type: BlockType;
  order: number;
  content: unknown; // shape varies by type; narrowed in BlockRenderer
  publicId?: string | null;
}

export interface Article {
  id: string;
  shortId?: string | null; // short-link code (e.g. /s/<shortId>)
  title: string;
  shortDescription: string;
  slug: string;
  author: string;
  mainImageUrl: string;
  mainImagePublicId?: string | null;
  published: boolean;
  publishedAt?: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt?: string;
  blocks?: ContentBlock[];
  _count?: { comments?: number; likes?: number };
}

/** A curated movie in the `byGenres` collection (recommendation, not a review). */
export interface GenreMovie {
  id: string;
  title: string;
  genre: string[];
  directedBy: string;
  year: number;
  posterImageUrl: string;
  synopsis: string;
}

export interface TopPick {
  id: string;
  title: string;
  year: number;
  genre: string;
  posterImageUrl: string;
  rank?: number;
  director?: string;
  synopsis?: string;
}

export interface TrendingMovie {
  id: number;
  tmdbId: number;
  title: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  overview?: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  trendingRank: number;
  genreIds: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN";
  profilePicture?: string | null;
}

export interface Paginated<T> {
  items: T[];
  pagination?: {
    currentPage: number;
    totalPages?: number;
    totalItems?: number;
    hasMore?: boolean;
  };
}
