import type { Metadata } from "next";
import Image from "next/image";
import { getTopPicks } from "@/lib/api";
import { topPickToCard } from "@/lib/adapters";
import { buildMetadata } from "@/lib/seo";
import AuthGate from "@/components/site/AuthGate";

export const revalidate = 600;

export const metadata: Metadata = buildMetadata({
  title: "Top Picks",
  description:
    "The Cinéprism's curated shortlist — films worth losing sleep over, argued for and unapologetic.",
  path: "/top-picks",
});

export default async function TopPicksPage() {
  const picks = (await getTopPicks()).map(topPickToCard);

  return (
    <div data-testid="top-picks-page">
      <section className="relative pt-40 sm:pt-48 pb-16 sm:pb-24 border-b border-white/10">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-gold" />
          </div>
          <h1 className="font-serif font-light text-white text-6xl sm:text-7xl lg:text-[9vw] leading-[0.88] tracking-[-0.02em]">
            Top Picks<span className="text-brand-gold">.</span>
          </h1>
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
        {picks.length === 0 ? (
          <p className="mx-6 sm:mx-10 font-mono text-sm text-zinc-500">No picks yet.</p>
        ) : (
          <AuthGate label="the full shortlist">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {picks.map((p, i) => (
              <div
                key={p.id}
                data-testid={`top-pick-${p.id}`}
                className="group relative border border-white/10 hover:border-white/25 transition-colors"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-surface">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority={i < 4}
                      className="object-cover film-still"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 font-serif italic text-3xl text-white/90 group-hover:text-gold transition-colors">
                    №{String(p.rank).padStart(2, "0")}
                  </span>
                  {p.genre ? (
                    <span className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-[0.28em] text-white/80 border border-white/25 px-2 py-1 bg-black/40 backdrop-blur-sm">
                      {p.genre}
                    </span>
                  ) : null}
                </div>
                <div className="p-5">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-2">
                    {p.director ? `${p.director} · ` : ""}{p.year}
                  </p>
                  <h2 className="font-serif text-white text-xl sm:text-2xl leading-tight">
                    {p.title}
                  </h2>
                  {p.synopsis ? (
                    <p className="mt-3 font-serif italic text-zinc-500 text-sm line-clamp-3">
                      {p.synopsis}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          </AuthGate>
        )}
      </section>
    </div>
  );
}
