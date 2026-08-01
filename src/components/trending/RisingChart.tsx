import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { TrendingItem } from "@/lib/tmdb";
import { releaseSignal } from "@/lib/tmdb";

function Stars({ rating }: { rating: number }) {
  // TMDB rating is /10 → /5
  const five = rating / 2;
  const full = Math.floor(five);
  const half = five - full >= 0.5;
  return (
    <span className="text-gold tracking-widest text-sm" aria-label={`${rating.toFixed(1)} out of 10`}>
      {"★".repeat(full)}{half ? "½" : ""}
    </span>
  );
}

export default function RisingChart({ items }: { items: TrendingItem[] }) {
  if (!items.length) return null;
  const maxPop = Math.max(...items.map((i) => i.popularity), 1);

  return (
    <div data-testid="rising-chart" className="border-t border-white/10">
      {items.map((m) => {
        const heat = Math.max(6, Math.round((m.popularity / maxPop) * 100));
        const signal = releaseSignal(m.releaseDate);
        return (
          <div
            key={m.id}
            data-testid={`rising-${m.tmdbId}`}
            className="group grid grid-cols-[auto_64px_1fr] sm:grid-cols-[auto_84px_1fr_auto] items-center gap-4 sm:gap-6 border-b border-white/10 py-5 sm:py-6 hover:bg-white/[0.02] transition-colors"
          >
            {/* Rank */}
            <span className="font-serif font-light text-3xl sm:text-5xl text-zinc-600 group-hover:text-gold transition-colors w-10 sm:w-16 text-center tabular-nums">
              {String(m.rank).padStart(2, "0")}
            </span>

            {/* Poster */}
            <div className="relative aspect-[2/3] w-16 sm:w-[84px] overflow-hidden bg-surface border border-white/10">
              {m.poster ? (
                <Image src={m.poster} alt={m.title} fill sizes="84px" className="object-cover film-still" />
              ) : null}
            </div>

            {/* Meta */}
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1.5">
                {m.genres.slice(0, 2).map((g) => (
                  <span key={g} className="font-mono text-[9px] uppercase tracking-[0.24em] text-zinc-500">
                    {g}
                  </span>
                ))}
                {signal ? (
                  <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-gold">· {signal}</span>
                ) : null}
              </div>
              <h3 className="font-serif text-white text-xl sm:text-2xl leading-tight truncate">
                {m.title} {m.year ? <span className="text-zinc-600 text-lg">({m.year})</span> : null}
              </h3>
              <div className="mt-2 flex items-center gap-4">
                <Stars rating={m.rating} />
                <span className="font-mono text-[10px] text-zinc-600">
                  {m.rating.toFixed(1)} · {Intl.NumberFormat("en", { notation: "compact" }).format(m.voteCount)} votes
                </span>
              </div>
              {/* Heat / momentum bar */}
              <div className="mt-3 flex items-center gap-3 max-w-xs">
                <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-zinc-600">Heat</span>
                <div className="h-px flex-1 bg-white/10">
                  <div className="h-px bg-brand-gold" style={{ width: `${heat}%` }} />
                </div>
              </div>
            </div>

            {/* Review cross-reference */}
            <div className="col-span-3 sm:col-span-1 sm:text-right pl-14 sm:pl-0">
              {m.reviewSlug ? (
                <Link
                  href={`/reviews/${m.reviewSlug}`}
                  className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.26em] text-white border-b border-brand-gold/60 hover:border-white pb-1 transition-colors"
                >
                  Read our review <ArrowUpRight className="h-3.5 w-3.5 text-gold" />
                </Link>
              ) : (
                <span className="font-mono text-[9px] uppercase tracking-[0.26em] text-zinc-700">
                  Not yet reviewed
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
