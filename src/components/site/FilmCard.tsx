import Link from "next/link";
import Image from "next/image";
import type { Review } from "@/types/content";

type FilmCardProps = {
  review: Review;
  /** "wide" = 16:9 (grids/related), "poster" = 3:4 (index columns). */
  ratio?: "wide" | "poster";
  priority?: boolean;
  index?: number;
};

export default function FilmCard({
  review,
  ratio = "wide",
  priority = false,
  index = 0,
}: FilmCardProps) {
  const aspect = ratio === "poster" ? "aspect-[3/4]" : "aspect-video";
  return (
    <Link
      href={`/reviews/${review.slug}`}
      data-testid={`film-card-${review.id}`}
      className="group block border border-white/10 hover:border-white/30 transition-colors"
    >
      <div className={`relative ${aspect} overflow-hidden bg-surface`}>
        {review.image ? (
          <Image
            src={review.image}
            alt={review.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            priority={priority}
            className="object-cover film-still group-hover:scale-[1.02] transition-transform duration-[1400ms] ease-film"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span className="font-serif italic text-zinc-700 text-2xl">
              {review.title}
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-2">
          {review.director || "Unknown"} · {review.year}
        </p>
        <h3 className="font-serif text-white text-xl sm:text-2xl leading-tight mb-2">
          {review.title}
        </h3>
        {review.tagline ? (
          <p className="font-serif italic text-zinc-500 text-sm line-clamp-2">
            {review.tagline}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
