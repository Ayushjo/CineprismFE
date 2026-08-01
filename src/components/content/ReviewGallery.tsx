import Image from "next/image";

/**
 * Contact-sheet of stills for a review (from the post's gallery images).
 * Server component — grayscale, letterboxed, cinematic.
 */
export default function ReviewGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  if (!images?.length) return null;
  return (
    <section data-testid="review-gallery" className="border-t border-white/10 py-16 sm:py-20">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
        <div className="flex items-center gap-4 mb-10">
          <span className="h-px w-10 bg-brand-gold" />
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500">
            The Contact Sheet — Stills
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {images.map((src, i) => (
            <figure key={i} className="group relative aspect-video overflow-hidden bg-ink">
              <Image
                src={src}
                alt={`${title} — still ${i + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover film-still"
              />
              <span className="absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.28em] text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
              </span>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
