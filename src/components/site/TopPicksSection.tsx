import Link from "next/link";
import Image from "next/image";

type PickCardData = {
  id: string;
  rank: number;
  title: string;
  year: number;
  genre: string;
  director: string | null;
  synopsis: string | null;
  image: string;
};

export default function TopPicksSection({ picks }: { picks: PickCardData[] }) {
  if (!picks.length) return null;
  const [featured, ...rest] = picks.slice(0, 5);

  return (
    <section id="picks" data-testid="top-picks" className="relative bg-ink py-24 sm:py-32 lg:py-40 border-t border-white/5">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 sm:mb-20">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-12 bg-gold" />
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500">
                The Prism&rsquo;s Choice
              </p>
            </div>
            <h2 className="font-serif font-light text-white text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight">
              Top Picks<span className="text-brand-gold">.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-4 max-w-md">
            <p className="font-mono text-sm leading-relaxed text-zinc-500 lg:text-right">
              Films worth losing sleep over — curated, argued for, unapologetic. The
              shortlist that survives every rewatch.
            </p>
            <Link
              href="/top-picks"
              className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400 hover:text-white border-b border-white/20 hover:border-white pb-2 transition-colors"
            >
              View all picks →
            </Link>
          </div>
        </div>

        {/* Showcase: featured #1 + ranked grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
          {/* Featured */}
          {featured && (
            <Link
              href="/top-picks"
              data-testid={`pick-card-${featured.id}`}
              className="group relative lg:col-span-6 overflow-hidden border border-white/10 hover:border-white/25 transition-colors"
            >
              <div className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-auto lg:h-full min-h-[420px] overflow-hidden bg-surface">
                {featured.image ? (
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    className="object-cover film-still scale-[1.03] group-hover:scale-100"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                <span className="absolute top-6 left-6 font-serif italic text-6xl sm:text-7xl text-white/90 group-hover:text-gold transition-colors leading-none">
                  01
                </span>
                <span className="absolute top-8 right-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/80 border border-white/25 px-3 py-1">
                  {featured.genre}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-300 mb-2">
                    {featured.director ? `${featured.director} · ` : ""}{featured.year}
                  </p>
                  <h3 className="font-serif text-white text-3xl sm:text-4xl lg:text-5xl leading-tight">
                    {featured.title}
                  </h3>
                  {featured.synopsis ? (
                    <p className="mt-3 font-serif italic text-zinc-300 text-base sm:text-lg max-w-lg line-clamp-2">
                      {featured.synopsis}
                    </p>
                  ) : null}
                </div>
              </div>
            </Link>
          )}

          {/* Ranked grid */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-5 lg:gap-6">
            {rest.map((p) => (
              <Link
                key={p.id}
                href="/top-picks"
                data-testid={`pick-card-${p.id}`}
                className="group relative overflow-hidden border border-white/10 hover:border-white/25 transition-colors"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="object-cover film-still scale-[1.03] group-hover:scale-100"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <span className="absolute top-4 left-4 font-serif italic text-3xl text-white/90 group-hover:text-gold transition-colors leading-none">
                    {String(p.rank).padStart(2, "0")}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-zinc-400 mb-1 truncate">
                      {p.genre} · {p.year}
                    </p>
                    <h3 className="font-serif text-white text-lg sm:text-xl leading-tight line-clamp-2">
                      {p.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
