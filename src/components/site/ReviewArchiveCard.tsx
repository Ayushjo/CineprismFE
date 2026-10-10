import Link from "next/link";
import Image from "next/image";
import type { Review } from "@/types/content";

function starString(stars: number): string {
  const full = Math.floor(stars);
  const half = stars - full >= 0.5;
  return "★".repeat(full) + (half ? "½" : "");
}

/** Poster card (matches GenreMovieCard): poster, director · year, title, stars. */
export default function ReviewArchiveCard({
  review,
  priority = false,
}: {
  review: Review;
  priority?: boolean;
}) {
  const image = review.poster || review.backdrop;
  return (
    <Link
      href={`/reviews/${review.slug}`}
      data-testid={`reviews-list-card-${review.id}`}
      className="group relative block border border-white/10 hover:border-white/25 transition-colors"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-surface">
        {image ? (
          <Image
            src={image}
            alt={review.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
            className="object-cover film-still scale-[1.04] group-hover:scale-100"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center px-3 text-center">
            <span className="font-serif italic text-zinc-700 text-lg">{review.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink from-10% via-ink/80 via-35% to-transparent to-65%" />

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-zinc-400 mb-1 truncate">
            {review.director || "Unknown"} · {review.year}
          </p>
          <h3 className="font-serif text-white text-lg leading-tight line-clamp-2 group-hover:italic">
            {review.title}
          </h3>
          {review.ratingAvg > 0 ? (
            <p className="mt-2 text-gold text-sm tracking-widest" aria-label={`${review.stars} out of 5 stars`}>
              {starString(review.stars)}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
