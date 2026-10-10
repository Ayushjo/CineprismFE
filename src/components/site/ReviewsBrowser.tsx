"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import type { Review } from "@/types/content";
import ReviewArchiveCard from "@/components/site/ReviewArchiveCard";

type SortKey = "recent" | "rating" | "az";

const sorts: { key: SortKey; label: string }[] = [
  { key: "recent", label: "Recent" },
  { key: "rating", label: "Rated" },
  { key: "az", label: "A–Z" },
];

function GenreDropdown({
  genres,
  value,
  onChange,
}: {
  genres: string[];
  value: string | null;
  onChange: (g: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = (g: string | null) => {
    onChange(g);
    setOpen(false);
  };

  const option = (label: string, g: string | null) => {
    const active = value === g;
    return (
      <li key={label}>
        <button
          type="button"
          role="option"
          aria-selected={active}
          onClick={() => pick(g)}
          className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${
            active ? "text-white bg-brand-gold/10" : "text-zinc-400 hover:bg-white hover:text-black"
          }`}
        >
          <span>{label}</span>
          {active && <Check className="h-3.5 w-3.5 text-brand-gold" />}
        </button>
      </li>
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        data-testid="genre-dropdown"
        className={`inline-flex min-w-[11rem] items-center justify-between gap-3 border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] transition-colors ${
          value ? "border-brand-gold text-white bg-brand-gold/10" : "border-white/15 text-zinc-300 hover:border-white/40"
        }`}
      >
        <span>{value ?? "All genres"}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label="Filter by genre"
          className="absolute right-0 lg:left-0 lg:right-auto z-50 mt-2 max-h-80 w-56 overflow-y-auto border border-white/15 bg-black/95 backdrop-blur-xl shadow-2xl py-1"
        >
          {option("All genres", null)}
          {genres.map((g) => option(g, g))}
        </ul>
      )}
    </div>
  );
}

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

          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {genres.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600">Genre</span>
                <GenreDropdown genres={genres} value={genre} onChange={setGenre} />
              </div>
            )}
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
        </div>

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
        <div className="mx-6 sm:mx-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-6">
          {filtered.map((r, i) => (
            <ReviewArchiveCard key={r.id} review={r} priority={i < 5} />
          ))}
        </div>
      )}
    </div>
  );
}
