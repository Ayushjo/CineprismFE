import Link from "next/link";
import type { Review } from "@/types/content";
import ReviewArchiveCard from "@/components/site/ReviewArchiveCard";

export default function RecentReviews({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) return null;
  return (
    <section
      id="reviews"
      data-testid="recent-reviews"
      className="relative bg-ink py-24 sm:py-32 lg:py-40 border-t border-white/5"
    >
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 mb-14 sm:mb-20">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-12 bg-white/40" />
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500">
                The Contact Sheet
              </p>
            </div>
            <h2 className="font-serif font-light text-white text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight">
              Recent<span className="italic text-zinc-400"> reviews</span>.
            </h2>
          </div>
          <Link
            href="/reviews"
            className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-400 hover:text-white border-b border-white/20 hover:border-white pb-2 transition-colors"
          >
            All Reviews →
          </Link>
        </div>
      </div>

      <div className="border-t border-l border-white/10 mx-6 sm:mx-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <ReviewArchiveCard key={r.id} review={r} index={i} />
        ))}
      </div>
    </section>
  );
}
