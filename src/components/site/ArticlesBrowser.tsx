"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { Article } from "@/types/content";
import ArticleCard from "@/components/site/ArticleCard";

type SortKey = "recent" | "reads" | "az";

const sorts: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Recent" },
  { key: "reads", label: "Most read" },
  { key: "az", label: "A–Z" },
];

function when(a: Article): number {
  return +new Date(a.publishedAt || a.createdAt);
}

export default function ArticlesBrowser({ articles }: { articles: Article[] }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let list = articles.filter((a) => {
      if (!needle) return true;
      return (
        a.title.toLowerCase().includes(needle) ||
        (a.shortDescription || "").toLowerCase().includes(needle) ||
        (a.author || "").toLowerCase().includes(needle)
      );
    });
    list = [...list];
    if (sort === "recent") list.sort((a, b) => when(b) - when(a));
    else if (sort === "reads") list.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    else list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [articles, q, sort]);

  const chip = (active: boolean) =>
    `font-mono text-[10px] uppercase tracking-[0.24em] px-3 py-1.5 border transition-colors ${
      active
        ? "border-brand-gold text-white bg-brand-gold/10"
        : "border-white/15 text-zinc-400 hover:border-white/40 hover:text-white"
    }`;

  const [first, ...rest] = filtered;

  return (
    <div data-testid="articles-browser">
      {/* Controls */}
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3 flex-1 lg:max-w-md border-b border-white/20 focus-within:border-white transition-colors py-1">
            <Search className="h-4 w-4 text-zinc-500 shrink-0" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search title, description, author…"
              data-testid="articles-search"
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

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          {String(filtered.length).padStart(3, "0")} {filtered.length === 1 ? "piece" : "pieces"}
          {q && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="ml-4 text-zinc-500 hover:text-white border-b border-white/20 hover:border-white pb-0.5"
            >
              Clear search
            </button>
          )}
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="mx-auto max-w-[1600px] px-6 sm:px-10 font-serif italic text-zinc-500 text-lg">
          Nothing matches that. Try a different search.
        </p>
      ) : (
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Featured only when unfiltered, so search results stay a clean grid */}
          {first && <ArticleCard article={first} featured={!q} priority />}
          {rest.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
