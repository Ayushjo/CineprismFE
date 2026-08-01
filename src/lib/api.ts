/*
 * Typed API client for the existing Express backend.
 * Public content is fetched server-side (RSC) with ISR revalidation.
 * The backend base URL comes from NEXT_PUBLIC_API_URL.
 */
import type { Article, Post, TopPick } from "@/types/content";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://api.thecineprism.com/api/v1";

export const DEFAULT_REVALIDATE = 300; // 5 min ISR for content lists

type FetchOpts = {
  revalidate?: number | false;
  method?: "GET" | "POST";
  body?: unknown;
  tags?: string[];
  auth?: string; // bearer token for authed server calls
};

async function apiFetch<T>(path: string, opts: FetchOpts = {}): Promise<T> {
  const { revalidate = DEFAULT_REVALIDATE, method = "GET", body, tags, auth } = opts;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = `Bearer ${auth}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
    next: revalidate === false ? undefined : { revalidate, tags },
    cache: revalidate === false ? "no-store" : undefined,
  });

  if (!res.ok) {
    throw new Error(`API ${method} ${path} failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

/* ----------------------------- Reviews (Posts) ---------------------------- */

export async function getAllPosts(): Promise<Post[]> {
  const data = await apiFetch<{ posts: Post[] }>("/admin/fetch-posts", {
    method: "POST",
    body: {},
    tags: ["posts"],
  });
  return data.posts ?? [];
}

export async function getLatestReviews(): Promise<Post[]> {
  const data = await apiFetch<{ latestReviews: Post[] }>("/admin/latest-reviews", {
    tags: ["posts"],
  });
  return data.latestReviews ?? [];
}

export async function getPostById(id: string): Promise<Post | null> {
  try {
    const data = await apiFetch<{ success?: boolean; post: Post }>(`/posts/${id}`, {
      tags: [`post:${id}`],
    });
    return data.post ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedPosts(id: string): Promise<Post[]> {
  try {
    const data = await apiFetch<{ relatedPosts: Post[] }>(`/posts/${id}/related`, {
      tags: [`post:${id}`],
    });
    return data.relatedPosts ?? [];
  } catch {
    return [];
  }
}

export async function getPostsByGenre(genre: string): Promise<Post[]> {
  // The /posts/search/:genre endpoint is auth-gated; derive from the public
  // all-posts list instead so genre pages work for anonymous visitors.
  const needle = genre.trim().toLowerCase();
  const posts = await getAllPosts().catch(() => []);
  return posts.filter((p) =>
    (p.genres ?? []).some((g) => g.trim().toLowerCase() === needle)
  );
}

/* -------------------------------- Articles -------------------------------- */

export async function getArticles(): Promise<Article[]> {
  const data = await apiFetch<{ articles: Article[] }>("/articles/get-articles", {
    tags: ["articles"],
  });
  return data.articles ?? [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const data = await apiFetch<{ article: Article }>(
      `/articles/get-article/${encodeURIComponent(slug)}`,
      { tags: [`article:${slug}`] }
    );
    return data.article ?? null;
  } catch {
    return null;
  }
}

/* ------------------------------- Top Picks -------------------------------- */

export async function getTopPicks(): Promise<TopPick[]> {
  try {
    const data = await apiFetch<{ topPicks: TopPick[] }>("/admin/fetch-top-picks", {
      method: "POST",
      body: {},
      tags: ["top-picks"],
    });
    return data.topPicks ?? [];
  } catch {
    return [];
  }
}

export { API_BASE };
