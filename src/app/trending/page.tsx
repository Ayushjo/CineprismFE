import type { Metadata } from "next";
import Image from "next/image";
import { getTrendingMovies, getTrendingNews, getAllPosts } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import {
  buildReviewIndex,
  toTrendingItem,
  toNewsItem,
  releaseSignal,
} from "@/lib/tmdb";
import RisingChart from "@/components/trending/RisingChart";
import TheWire from "@/components/trending/TheWire";

export const revalidate = 900; // 15 min — trending data refreshes periodically

export const metadata: Metadata = buildMetadata({
  title: "The Pulse — What the World Is Watching",
  description:
    "The films moving the needle this week, read through The Cinéprism lens — a ranked chart cross-referenced with our own reviews, plus dispatches from the industry.",
  path: "/trending",
});

function updatedAgo(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const h = Math.floor((Date.now() - d.getTime()) / 3600000);
  if (h < 1) return "moments ago";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default async function TrendingPage() {
  const [rawMovies, rawNews, posts] = await Promise.all([
    getTrendingMovies(),
    getTrendingNews(),
    getAllPosts().catch(() => []),
  ]);

  const reviewIndex = buildReviewIndex(posts);
  const movies = rawMovies
    .map((m) => toTrendingItem(m, reviewIndex))
    .sort((a, b) => a.rank - b.rank);
  const news = rawNews.map(toNewsItem);

  const hero = movies[0];
  const reviewedCount = movies.filter((m) => m.reviewSlug).length;
  const updated = updatedAgo(rawMovies[0]?.last_updated);

  return (
    <div data-testid="trending-page">
      {/* Hero — #1 trending film */}
      <section className="relative min-h-[85svh] flex items-end overflow-hidden bg-ink">
        {hero?.backdrop ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={hero.backdrop}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-60"
              style={{ filter: "grayscale(30%) contrast(1.05)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
          </div>
        ) : null}

        <div className="relative z-10 mx-auto max-w-[1600px] w-full px-6 sm:px-10 pb-16 sm:pb-24 pt-40">
          <div className="flex items-center gap-4 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-gold" />
            </span>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-300">
              The Pulse {updated ? `· Updated ${updated}` : ""}
            </p>
          </div>

          <h1 className="font-serif font-light text-white text-6xl sm:text-7xl lg:text-[7vw] leading-[0.9] tracking-[-0.02em] max-w-5xl">
            What the world is <span className="italic text-brand-gold">watching</span>.
          </h1>

          {hero ? (
            <div className="mt-10 flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-12">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">
                  № 01 — Trending now
                </p>
                <p className="font-serif italic text-white text-2xl sm:text-3xl">
                  {hero.title} {hero.year ? <span className="text-zinc-500">({hero.year})</span> : null}
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.28em] text-gold">
                  {[hero.genres.join(" · "), releaseSignal(hero.releaseDate)].filter(Boolean).join(" — ")}
                </p>
              </div>
              <div className="h-px sm:h-12 w-24 sm:w-px bg-white/15" aria-hidden />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-1">
                  Reviewed by us
                </p>
                <p className="font-serif text-white text-2xl sm:text-3xl">
                  {String(reviewedCount).padStart(2, "0")}{" "}
                  <span className="text-zinc-600 text-lg">of {String(movies.length).padStart(2, "0")}</span>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* The Rising — ranked chart */}
      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px w-12 bg-brand-gold" />
                <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500">
                  The chart · Top {movies.length}
                </p>
              </div>
              <h2 className="font-serif font-light text-white text-5xl sm:text-6xl leading-[0.9] tracking-tight">
                The <span className="italic text-zinc-400">Rising</span>.
              </h2>
            </div>
            <p className="font-mono text-[11px] leading-relaxed text-zinc-500 max-w-sm lg:text-right">
              Ranked by global momentum, rated by the crowd — and flagged where the
              Cinéprism has already weighed in.
            </p>
          </div>

          {movies.length === 0 ? (
            <p className="font-serif italic text-zinc-500 text-lg">
              The chart is refreshing — check back shortly.
            </p>
          ) : (
            <RisingChart items={movies} />
          )}
        </div>
      </section>

      {/* The Wire — industry news */}
      <TheWire items={news} />
    </div>
  );
}
