/*
 * Types mirroring the Express/Prisma backend responses.
 * Source of truth: testingcineprismbackend/prisma/schema.prisma
 */

export interface RatingCategory {
  category: string;
  score: number; // 0–100
}

/** Backend `Post` (a review). */
export interface Post {
  id: string;
  title: string;
  content: string; // plain text, paragraphs separated by blank lines
  genres: string[];
  year: number;
  directedBy: string;
  streamingAt: string;
  language: string;
  posterImageUrl?: string | null;
  reviewPosterImageUrl?: string | null;
  ratingCategories: RatingCategory[];
  viewCount: number;
  relatedPostIds?: string[];
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
  title: string;
  year: number;
  genres: string[];
  director: string;
  streaming: string;
  language: string;
  image?: string | null;
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
