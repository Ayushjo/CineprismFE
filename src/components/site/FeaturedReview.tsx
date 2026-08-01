import Link from "next/link";
import Image from "next/image";
import type { Review } from "@/types/content";

export default function FeaturedReview({ review }: { review: Review | null }) {
  if (!review) return null;
  return (
    <section id="featured" data-testid="featured-review" className="relative bg-ink py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <div className="flex items-center gap-4 mb-16 sm:mb-24">
          <span className="h-px w-12 bg-brand-gold" />
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500">
            The Feature — Now on the marquee
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <Link href={`/reviews/${review.slug}`} className="group relative block overflow-hidden">
              <div className="relative aspect-[2.35/1] overflow-hidden bg-surface">
                {review.backdrop || review.poster ? (
                  <Image
                    src={(review.backdrop || review.poster) as string}
                    alt={review.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover film-still scale-[1.02] group-hover:scale-100"
                  />
                ) : null}
              </div>
              <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                <span>Still — {review.title}</span>
                <span>{review.year} · {review.language}</span>
              </div>
            </Link>

            {/* Gallery strip — fills the space beneath the still */}
            {review.gallery && review.gallery.length > 0 && (
              <div className="mt-5 grid grid-cols-4 gap-2 sm:gap-3">
                {review.gallery.slice(0, 4).map((src, i) => (
                  <Link
                    key={i}
                    href={`/reviews/${review.slug}`}
                    data-testid={`featured-gallery-${i}`}
                    className="group relative aspect-[3/2] overflow-hidden bg-surface border border-white/10"
                  >
                    <Image
                      src={src}
                      alt={`${review.title} — still ${i + 1}`}
                      fill
                      sizes="(max-width: 1024px) 25vw, 150px"
                      className="object-cover film-still"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 lg:pt-14 order-1 lg:order-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-6">
              The Feature Review
            </p>
            <h2 className="font-serif font-light text-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-8">
              {review.title}.
            </h2>
            {review.tagline ? (
              <p className="font-serif italic text-zinc-300 text-xl sm:text-2xl leading-relaxed mb-10">
                {review.tagline}
              </p>
            ) : null}

            <dl className="grid grid-cols-2 gap-y-4 gap-x-6 border-t border-white/10 pt-6 mb-10 font-mono text-[11px]">
              <div>
                <dt className="uppercase tracking-[0.25em] text-zinc-600 mb-1">Director</dt>
                <dd className="text-zinc-200">{review.director || "—"}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.25em] text-zinc-600 mb-1">Year</dt>
                <dd className="text-zinc-200">{review.year}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.25em] text-zinc-600 mb-1">Language</dt>
                <dd className="text-zinc-200">{review.language || "—"}</dd>
              </div>
              <div>
                <dt className="uppercase tracking-[0.25em] text-zinc-600 mb-1">Streaming</dt>
                <dd className="text-gold">{review.streaming || "—"}</dd>
              </div>
            </dl>

            <Link
              href={`/reviews/${review.slug}`}
              className="group inline-flex items-center gap-4 border-b border-white/40 pb-2 hover:border-white transition-colors"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.32em] text-white">
                Read the review
              </span>
              <span className="text-brand-gold group-hover:translate-x-1 transition-transform duration-500">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
