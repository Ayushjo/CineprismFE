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

function PickCard({ pick, large, index }: { pick: PickCardData; large?: boolean; index: number }) {
  return (
    <Link
      href="/top-picks"
      data-testid={`pick-card-${pick.id}`}
      className={`group relative block overflow-hidden bg-surface border border-white/5 hover:border-white/20 transition-colors duration-500 ${
        large ? "lg:col-span-8 lg:row-span-2" : "lg:col-span-4"
      }`}
    >
      <div className={`relative overflow-hidden ${large ? "aspect-[16/12] lg:aspect-[3/4]" : "aspect-[4/3]"}`}>
        {pick.image ? (
          <Image
            src={pick.image}
            alt={pick.title}
            fill
            sizes={large ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"}
            className="object-cover film-still scale-[1.03] group-hover:scale-100"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <span className="absolute top-6 right-6 font-serif italic text-zinc-400 text-3xl group-hover:text-gold transition-colors duration-500">
          №{String(pick.rank).padStart(2, "0")}
        </span>
        <span className="absolute top-6 left-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/80 border border-white/25 px-3 py-1">
          {pick.genre}
        </span>
      </div>

      <div className={`p-6 sm:p-8 ${large ? "lg:p-10" : ""}`}>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-3">
          {pick.director ? `${pick.director} · ` : ""}{pick.year}
        </p>
        <h3 className={`font-serif text-white leading-tight tracking-tight ${large ? "text-4xl sm:text-5xl lg:text-6xl" : "text-2xl sm:text-3xl"}`}>
          {pick.title}
        </h3>
        {pick.synopsis ? (
          <p className={`${large ? "mt-6 text-lg sm:text-xl max-w-md" : "mt-4 text-xs"} font-serif italic text-zinc-400 leading-relaxed`}>
            {pick.synopsis}
          </p>
        ) : null}
        <div className="mt-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 group-hover:text-white transition-colors">
          <span>View pick</span>
          <span className="h-px w-8 bg-current group-hover:w-14 transition-all duration-500" />
        </div>
      </div>
    </Link>
  );
}

export default function TopPicksSection({ picks }: { picks: PickCardData[] }) {
  if (!picks.length) return null;
  const [large, ...rest] = picks.slice(0, 3);
  return (
    <section id="picks" data-testid="top-picks" className="relative bg-ink py-24 sm:py-32 lg:py-40 border-t border-white/5">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-16 sm:mb-20">
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
          <div className="flex flex-col items-start lg:items-end gap-4">
            <p className="font-mono text-sm text-zinc-500 max-w-md">
              Films worth losing sleep over. Curated, argued for, unapologetic — the shortlist that survives every rewatch.
            </p>
            <Link
              href="/top-picks"
              className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400 hover:text-white border-b border-white/20 hover:border-white pb-2 transition-colors"
            >
              View all picks →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {large && <PickCard pick={large} large index={0} />}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:gap-8">
            {rest.map((p, i) => (
              <PickCard key={p.id} pick={p} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
