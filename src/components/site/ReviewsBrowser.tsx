"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { Review } from "@/types/content";
import ReviewArchiveCard from "@/components/site/ReviewArchiveCard";

type SortKey = "recent" | "rating" | "az";

const sorts: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Recent" },
  { key: "rating", label: "Rated" },
  { key: "az", label: "A–Z" },
];

export default function ReviewsBrowser({ reviews }: { reviews: Review[] }) {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("recent");

  const genres = useMemo(() => {
    const set = new Set<string>();
    reviews.forEach((r) => r.genres.forEach((g) => set.add(g)));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [reviews]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = reviews.filter((r) => {
      if (genre && !r.genres.includes(genre)) return false;
      if (!needle) return true;
      return (
        r.title.toLowerCase().includes(needle) ||
        r.director.toLowerCase().includes(needle) ||
        r.genres.some((g) => g.toLowerCase().includes(needle))
      );
    });
    list = [...list];
    if (sort === "recent")
      list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    else if (sort === "rating") list.sort((a, b) => b.ratingAvg - a.ratingAvg);
    else list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [reviews, q, genre, sort]);

  const chip = (active: boolean) =>
    `font-mono text-[10px] uppercase tracking-[0.24em] px-3 py-1.5 border transition-colors ${
      active
        ? "border-brand-gold text-white bg-brand-gold/10"
        : "border-white/15 text-zinc-400 hover:border-white/40 hover:text-white"
    }`;

  return (
    <div data-testid="reviews-browser">
      {/* Controls */}
      <div className="mx-6 sm:mx-10 mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3 flex-1 lg:max-w-md border-b border-white/20 focus-within:border-white transition-colors py-1">
            <Search className="h-4 w-4 text-zinc-500 shrink-0" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, director, genre…"
              data-testid="reviews-search"
              className="flex-1 min-w-0 bg-transparent font-mono text-sm text-white placeholder:text-zinc-600 focus:outline-none py-1.5"
            />
            {q && (
              <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="text-zinc-500 hover:text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600">Sort</span>
            <div className="flex items-center gap-2">
              {sorts.map((s) => (
                <button key={s.key} type="button" onClick={() => setSort(s.key)} className={chip(sort === s.key)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Genre filter */}
        {genres.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-6">
            <button type="button" onClick={() => setGenre(null)} className={chip(genre === null)}>
              All
            </button>
            {genres.map((g) => (
              <button key={g} type="button" onClick={() => setGenre(genre === g ? null : g)} className={chip(genre === g)}>
                {g}
              </button>
            ))}
          </div>
        )}

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          {String(filtered.length).padStart(3, "0")} {filtered.length === 1 ? "result" : "results"}
          {(q || genre) && (
            <button
              type="button"
              onClick={() => { setQ(""); setGenre(null); }}
              className="ml-4 text-zinc-500 hover:text-white border-b border-white/20 hover:border-white pb-0.5"
            >
              Clear filters
            </button>
          )}
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="mx-6 sm:mx-10 font-serif italic text-zinc-500 text-lg">
          Nothing matches that. Try a different search.
        </p>
      ) : (
        <div className="border-t border-l border-white/10 mx-6 sm:mx-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => (
            <ReviewArchiveCard key={r.id} review={r} index={i} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
