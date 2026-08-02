import Image from "next/image";
import { theaterImage } from "@/lib/media";
import type { Quote } from "@/lib/api";

/**
 * A cinematic film-quote interstitial — italic serif over a dark still,
 * flanked by hairline rules. Decorative editorial punctuation between sections.
 */
export default function QuoteBand({ quote }: { quote: Quote | null }) {
  if (!quote) return null;
  return (
    <section
      data-testid="quote-band"
      className="relative border-y border-white/5 overflow-hidden bg-ink"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src={theaterImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          style={{ filter: "grayscale(60%) contrast(1.05)" }}
        />
        <div className="absolute inset-0 bg-ink/75" />
      </div>

      <figure className="relative z-10 mx-auto max-w-4xl px-6 sm:px-10 py-24 sm:py-32 text-center">
        <blockquote className="font-serif italic text-white text-3xl sm:text-4xl lg:text-5xl leading-[1.25]">
          <span aria-hidden className="text-brand-gold">&ldquo;</span>
          {quote.quote}
          <span aria-hidden className="text-brand-gold">&rdquo;</span>
        </blockquote>
        <figcaption className="mt-10 flex items-center justify-center gap-6">
          <span className="h-px w-12 bg-white/25" aria-hidden />
          <cite className="not-italic font-mono text-[11px] sm:text-xs uppercase tracking-[0.35em] text-zinc-400">
            {quote.author}
          </cite>
          <span className="h-px w-12 bg-white/25" aria-hidden />
        </figcaption>
      </figure>
    </section>
  );
}
