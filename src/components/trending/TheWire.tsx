"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { NewsItem } from "@/lib/tmdb";

function timeAgo(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const h = Math.floor((Date.now() - d.getTime()) / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

export default function TheWire({ items }: { items: NewsItem[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.category && set.add(i.category));
    return [...set].sort();
  }, [items]);

  const [cat, setCat] = useState<string | null>(null);
  const shown = useMemo(
    () => (cat ? items.filter((i) => i.category === cat) : items).slice(0, 12),
    [items, cat]
  );

  if (!items.length) return null;

  const chip = (active: boolean) =>
    `font-mono text-[10px] uppercase tracking-[0.24em] px-3 py-1.5 border transition-colors ${
      active
        ? "border-brand-gold text-white bg-brand-gold/10"
        : "border-white/15 text-zinc-400 hover:border-white/40 hover:text-white"
    }`;

  return (
    <section id="the-wire" data-testid="the-wire" className="border-t border-white/10 py-20 sm:py-28">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-12 bg-white/40" />
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500">
                Dispatches from the industry
              </p>
            </div>
            <h2 className="font-serif font-light text-white text-5xl sm:text-6xl leading-[0.9] tracking-tight">
              The <span className="italic text-zinc-400">Wire</span>.
            </h2>
          </div>
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setCat(null)} className={chip(cat === null)}>
                All
              </button>
              {categories.map((c) => (
                <button key={c} type="button" onClick={() => setCat(cat === c ? null : c)} className={chip(cat === c)}>
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {shown.map((n) => (
            <a
              key={n.id}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
              data-testid={`wire-${n.id}`}
              className="group flex flex-col bg-ink hover:bg-white/[0.02] transition-colors"
            >
              <div className="relative aspect-video overflow-hidden bg-surface">
                {n.image ? (
                  <Image
                    src={n.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover film-still"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-700">
                      {n.source}
                    </span>
                  </div>
                )}
                <span className="absolute top-3 left-3 font-mono text-[9px] uppercase tracking-[0.26em] text-white/90 border border-white/30 px-2 py-1 bg-black/50 backdrop-blur-sm">
                  {n.category}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-zinc-500 mb-3">
                  {n.source} · {timeAgo(n.publishedAt)}
                </p>
                <h3 className="font-serif text-white text-xl leading-tight mb-3 line-clamp-2 group-hover:italic transition-all">
                  {n.title}
                </h3>
                <p className="font-mono text-[11px] leading-relaxed text-zinc-500 line-clamp-3 mb-4">
                  {n.description}
                </p>
                <span className="mt-auto font-mono text-[9px] uppercase tracking-[0.3em] text-zinc-500 group-hover:text-white transition-colors">
                  Read at source ↗
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
