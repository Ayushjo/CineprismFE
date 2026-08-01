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

export default function NewsletterPage() {
  return (
    <div data-testid="newsletter-page">
      <section className="relative pt-40 sm:pt-48 pb-14 sm:pb-20 border-b border-white/10">
        <div className="mx-auto max-w-[1100px] px-6 sm:px-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-brand-gold" />
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500">
              The Dispatch
            </p>
          </div>
          <h1 className="font-serif font-light text-white text-6xl sm:text-7xl lg:text-[7vw] leading-[0.9] tracking-[-0.02em]">
            The Cinéprism
            <span className="italic text-brand-gold"> Weekly</span>.
          </h1>
          <p className="mt-8 font-mono text-sm sm:text-base leading-relaxed text-zinc-300 max-w-2xl">
            Deep dives, honest reviews, and curated film picks — delivered every Friday.
            Written for people who take cinema seriously.
          </p>
        </div>
      </section>

      <section className="relative py-16 sm:py-24">
        <Suspense fallback={<p className="mx-auto max-w-[1100px] px-6 sm:px-10 font-mono text-sm text-zinc-500">Loading…</p>}>
          <NewsletterCheckout />
        </Suspense>
      </section>
    </div>
  );
}
