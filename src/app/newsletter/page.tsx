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
    n: "01",
    kicker: "Every Friday",
    title: "The Dispatch",
    body: "One considered letter a week — no filler, no listicles for the algorithm. Just the films worth your evening and why.",
  },
  {
    n: "02",
    kicker: "The Long Read",
    title: "Deep Dives",
    body: "Essays that sit with a film — its frames, its silences, its politics. Criticism as devotion, not verdict.",
  },
  {
    n: "03",
    kicker: "Hand-picked",
    title: "Curated Picks",
    body: "A shortlist of what to actually watch — streaming, theatres, forgotten gems — argued for, never padded.",
  },
];

export default function NewsletterPage() {
  return (
    <div data-testid="newsletter-page">
      {/* Hero */}
      <section className="relative pt-40 sm:pt-48 pb-16 sm:pb-20 border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-brand-gold" />
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500">
              The Dispatch — Est. 2019
            </p>
          </div>
          <h1 className="font-serif font-light text-white text-6xl sm:text-7xl lg:text-[8vw] leading-[0.9] tracking-[-0.02em] max-w-5xl">
            The Cinéprism
            <span className="italic text-brand-gold"> Weekly</span>.
          </h1>
          <p className="mt-8 font-serif italic text-zinc-300 text-xl sm:text-2xl leading-relaxed max-w-2xl">
            A letter for people who take cinema seriously — reviews, essays and quiet
            obsessions, in your inbox every Friday.
          </p>
        </div>
      </section>

      {/* Two columns: editorial pitch + sticky subscribe card */}
      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left — what's inside */}
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-12">
              <span className="h-px w-10 bg-white/40" />
              <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-zinc-500">
                What lands in your inbox
              </p>
            </div>

            <div className="border-t border-white/10">
              {inside.map((item) => (
                <div
                  key={item.title}
                  className="grid grid-cols-[auto_1fr] gap-6 sm:gap-10 border-b border-white/10 py-8 sm:py-10"
                >
                  <span className="font-mono text-[11px] text-zinc-600 pt-2">{item.n}</span>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-3">
                      {item.kicker}
                    </p>
                    <h3 className="font-serif font-light text-white text-3xl sm:text-4xl mb-4">
                      {item.title}
                    </h3>
                    <p className="font-mono text-sm leading-relaxed text-zinc-400 max-w-xl">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-10 font-serif italic text-zinc-400 text-lg leading-relaxed max-w-xl">
              World cinema, the American canon, Bollywood and everything the mainstream
              overlooks — one honest voice, no algorithm.
            </p>
          </div>

          {/* Right — sticky subscribe card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <Suspense fallback={<div className="border border-white/15 p-10 font-mono text-sm text-zinc-500">Loading…</div>}>
              <NewsletterCheckout />
            </Suspense>
          </div>
        </div>
      </section>
    </div>
  );
}
