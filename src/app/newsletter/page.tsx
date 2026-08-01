import type { Metadata } from "next";
import { Suspense } from "react";
import { buildMetadata } from "@/lib/seo";
import NewsletterCheckout from "@/components/site/NewsletterCheckout";

export const metadata: Metadata = buildMetadata({
  title: "The Cinéprism Weekly",
  description:
    "Deep dives, honest reviews and curated film picks — delivered every Friday. Written for people who take cinema seriously.",
  path: "/newsletter",
});

const inside = [
  {
    kicker: "Every Friday",
    title: "The Dispatch",
    body: "One considered letter a week — no filler, no listicles for the algorithm. Just the films worth your evening and why.",
  },
  {
    kicker: "The Long Read",
    title: "Deep Dives",
    body: "Essays that sit with a film — its frames, its silences, its politics. Criticism as devotion, not verdict.",
  },
  {
    kicker: "Hand-picked",
    title: "Curated Picks",
    body: "A shortlist of what to actually watch — streaming, theatres, forgotten gems — argued for, never padded.",
  },
];

const editions = [
  {
    tag: "Hollywood Edition",
    line: "World cinema, festival circuits, the American canon and its edges.",
  },
  {
    tag: "Bollywood Edition",
    line: "Hindi cinema and the subcontinent — the mainstream, the parallel, the overlooked.",
  },
];

export default function NewsletterPage() {
  return (
    <div data-testid="newsletter-page">
      {/* Hero */}
      <section className="relative pt-40 sm:pt-48 pb-16 sm:pb-24 border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-brand-gold" />
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500">
              The Dispatch — Est. 2019
            </p>
          </div>
          <h1 className="font-serif font-light text-white text-6xl sm:text-7xl lg:text-[8vw] leading-[0.9] tracking-[-0.02em]">
            The Cinéprism
            <span className="italic text-brand-gold"> Weekly</span>.
          </h1>
          <p className="mt-8 font-serif italic text-zinc-300 text-xl sm:text-2xl leading-relaxed max-w-3xl">
            A letter for people who take cinema seriously. Reviews, essays and quiet
            obsessions — delivered every Friday, straight to the dark of your inbox.
          </p>
        </div>
      </section>

      {/* What's inside */}
      <section className="relative py-20 sm:py-28 border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <div className="flex items-center gap-4 mb-14">
            <span className="h-px w-10 bg-white/40" />
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
              What lands in your inbox
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10">
            {inside.map((item) => (
              <div key={item.title} className="border-r border-b border-white/10 p-8 lg:p-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-6">
                  {item.kicker}
                </p>
                <h3 className="font-serif font-light text-white text-3xl mb-4">{item.title}</h3>
                <p className="font-mono text-sm leading-relaxed text-zinc-400">{item.body}</p>
              </div>
            ))}
          </div>

          {/* Two editions */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {editions.map((e) => (
              <div key={e.tag} className="border border-white/10 p-8 lg:p-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4">
                  {e.tag}
                </p>
                <p className="font-serif italic text-zinc-200 text-xl leading-relaxed">{e.line}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans / checkout */}
      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px w-10 bg-brand-gold" />
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
              Reserve your seat
            </p>
          </div>
          <h2 className="font-serif font-light text-white text-4xl sm:text-5xl">
            Choose your <span className="italic text-zinc-400">reel</span>.
          </h2>
        </div>

        <Suspense fallback={<p className="mx-auto max-w-[1100px] px-6 sm:px-10 font-mono text-sm text-zinc-500">Loading plans…</p>}>
          <NewsletterCheckout />
        </Suspense>
      </section>
    </div>
  );
}
