import Link from "next/link";
import { GENRES } from "@/lib/genres";

const nameHover: Record<string, string> = {
  red: "group-hover:text-brand-gold",
  gold: "group-hover:text-gold",
  neutral: "group-hover:text-white",
};
const fill: Record<string, string> = {
  red: "bg-brand-gold/[0.06]",
  gold: "bg-gold/[0.06]",
  neutral: "bg-white/[0.03]",
};
const arrow: Record<string, string> = {
  red: "text-brand-gold",
  gold: "text-gold",
  neutral: "text-white",
};

export default function GenresSection() {
  return (
    <section
      id="genres"
      data-testid="genres-section"
      className="relative bg-ink py-24 sm:py-32 lg:py-40 border-t border-white/5 overflow-hidden"
    >
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <div className="flex items-end justify-between gap-6 mb-16 sm:mb-20">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-12 bg-white/40" />
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500">
                Explore by Grammar
              </p>
            </div>
            <h2 className="font-serif font-light text-white text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight">
              Genres,<span className="italic text-zinc-500"> refracted</span>.
            </h2>
          </div>
          <Link
            href="/genres"
            className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400 hover:text-white border-b border-white/20 hover:border-white pb-2 transition-colors whitespace-nowrap"
          >
            All {String(GENRES.length).padStart(2, "0")} grammars →
          </Link>
        </div>

        <div className="border-t border-white/10">
          {GENRES.map((g, i) => (
            <Link
              key={g.slug}
              href={`/genres/${g.slug}`}
              data-testid={`home-genre-${g.slug}`}
              className="group relative flex items-center justify-between border-b border-white/10 py-6 sm:py-8 lg:py-10 transition-all duration-500 hover:pl-6"
            >
              <span
                aria-hidden="true"
                className={`absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-film ${fill[g.accent]}`}
              />
              <div className="relative flex items-baseline gap-6 sm:gap-10">
                <span className="font-mono text-xs text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                <h3 className={`font-serif font-light text-3xl sm:text-5xl lg:text-6xl tracking-tight text-zinc-500 transition-colors duration-500 ${nameHover[g.accent]}`}>
                  {g.name}
                </h3>
              </div>
              <div className="relative flex items-center gap-6">
                <span className="hidden sm:inline font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600 group-hover:text-zinc-300 transition-colors">
                  {g.tagline}
                </span>
                <span className={`font-serif text-2xl sm:text-3xl transition-all duration-500 -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 ${arrow[g.accent]}`}>
                  ↗
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
