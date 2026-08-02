import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { GENRES } from "@/lib/genres";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Genres",
  description:
    "Explore The Cinéprism by grammar — reviews sorted across Sci-Fi, Thriller, Drama, Horror, Animation and more.",
  path: "/genres",
});

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

export default function GenresPage() {
  return (
    <div data-testid="genres-page">
      <section className="relative pt-40 sm:pt-48 pb-16 sm:pb-24 border-b border-white/10">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-brand-gold" />
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500">
              Explore by Grammar
            </p>
          </div>
          <h1 className="font-serif font-light text-white text-6xl sm:text-7xl lg:text-[9vw] leading-[0.88] tracking-[-0.02em]">
            Genres<span className="italic text-zinc-500">, refracted</span>
            <span className="text-brand-gold">.</span>
          </h1>
        </div>
      </section>

      <section className="relative py-10 sm:py-16">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 border-t border-white/10">
          {GENRES.map((g, i) => (
            <Link
              key={g.slug}
              href={`/genres/${g.slug}`}
              data-testid={`genre-pillar-${g.slug}`}
              className="group relative flex items-center justify-between border-b border-white/10 py-8 sm:py-10 lg:py-12 transition-all duration-500 hover:pl-6"
            >
              <span aria-hidden className={`absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-film ${fill[g.accent]}`} />
              <div className="relative flex items-baseline gap-6 sm:gap-10">
                <span className="font-mono text-xs text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                <h2 className={`font-serif font-light text-4xl sm:text-6xl lg:text-7xl tracking-tight text-zinc-500 transition-colors duration-500 ${nameHover[g.accent]}`}>
                  {g.name}
                </h2>
              </div>
              <div className="relative hidden sm:flex items-center gap-6 max-w-xs text-right">
                <span className="font-serif italic text-zinc-600 group-hover:text-zinc-300 transition-colors">
                  {g.tagline}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
