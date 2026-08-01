import Link from "next/link";
import Image from "next/image";
import type { Review } from "@/types/content";

function starString(stars: number): string {
  const full = Math.floor(stars);
  const half = stars - full >= 0.5;
  return "★".repeat(full) + (half ? "½" : "");
}

export default function ReviewArchiveCard({
  review,
  index,
  priority = false,
}: {
  review: Review;
  index: number;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/reviews/${review.slug}`}
      data-testid={`reviews-list-card-${review.id}`}
      className="group relative block border-r border-b border-white/10 p-6 sm:p-8 lg:p-10 overflow-hidden hover:bg-white/[0.02] transition-colors duration-500"
    >
      <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-surface">
        {review.image ? (
          <Image
            src={review.image}
            alt={review.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover film-still scale-[1.04] group-hover:scale-100"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-serif italic text-zinc-700 text-2xl px-6 text-center">
              {review.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-700" />
        <span className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.28em] text-white/90 border border-white/40 px-2 py-1 bg-black/50 backdrop-blur-sm">
          № {String(index + 1).padStart(3, "0")}
        </span>
        {review.streaming ? (
          <span className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-[0.28em] text-gold border border-gold/50 px-2 py-1 bg-black/50 backdrop-blur-sm">
            {review.streaming}
          </span>
        ) : null}
      </div>

      {review.genres.length > 0 && (
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          {review.genres.slice(0, 3).map((g) => (
            <span
              key={g}
              className="font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-500 border-b border-white/10 pb-0.5"
            >
              {g}
            </span>
          ))}
        </div>
      )}

      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-3">
        {review.director || "Unknown"} · {review.year}
      </p>
      <h3 className="font-serif text-white text-2xl sm:text-3xl leading-tight tracking-tight mb-3 group-hover:italic transition-all duration-500">
        {review.title}
      </h3>
      {review.tagline ? (
        <p className="font-serif italic text-zinc-400 text-base leading-relaxed mb-6 line-clamp-3">
          {review.tagline}
        </p>
      ) : null}

      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-gold tracking-widest text-sm">
          {review.ratingAvg > 0 ? starString(review.stars) : "—"}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 group-hover:text-white transition-colors">
          Read →
        </span>
      </div>
    </Link>
  );
}
