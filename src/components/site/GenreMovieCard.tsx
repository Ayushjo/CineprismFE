import Image from "next/image";
import type { GenreMovie } from "@/types/content";

export default function GenreMovieCard({
  movie,
  priority = false,
}: {
  movie: GenreMovie;
  priority?: boolean;
}) {
  return (
    <div
      data-testid={`genre-movie-${movie.id}`}
      className="group relative border border-white/10 hover:border-white/25 transition-colors"
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-surface">
        {movie.posterImageUrl ? (
          <Image
            src={movie.posterImageUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
            className="object-cover film-still"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center px-3 text-center">
            <span className="font-serif italic text-zinc-700 text-lg">{movie.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />

        {/* Synopsis overlay on hover */}
        {movie.synopsis ? (
          <div className="absolute inset-0 flex items-end bg-ink/85 opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-5">
            <p className="font-serif italic text-zinc-200 text-sm leading-relaxed line-clamp-[10]">
              {movie.synopsis}
            </p>
          </div>
        ) : null}

        {/* Bottom label */}
        <div className="absolute bottom-0 left-0 right-0 p-4 group-hover:opacity-0 transition-opacity duration-300">
          <p className="font-mono text-[9px] uppercase tracking-[0.26em] text-zinc-400 mb-1 truncate">
            {movie.directedBy || "Unknown"} · {movie.year}
          </p>
          <h3 className="font-serif text-white text-lg leading-tight line-clamp-2">
            {movie.title}
          </h3>
        </div>
      </div>
    </div>
  );
}
