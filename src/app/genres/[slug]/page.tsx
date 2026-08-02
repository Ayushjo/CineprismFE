import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getGenreMovies } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import { GENRES, genreBySlug } from "@/lib/genres";
import GenreMovieCard from "@/components/site/GenreMovieCard";
import AuthGate from "@/components/site/AuthGate";

export const revalidate = 1800;

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return GENRES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const genre = genreBySlug(slug);
  if (!genre) return buildMetadata({ title: "Genre not found", path: `/genres/${slug}` });
  return buildMetadata({
    title: `${genre.name} — Curated Films`,
    description: `A curated collection of ${genre.name.toLowerCase()} films from The Cinéprism — ${genre.tagline}`,
    path: `/genres/${genre.slug}`,
  });
}

export default async function GenreDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const genre = genreBySlug(slug);
  if (!genre) notFound();

  const movies = (await getGenreMovies(genre.query)).sort(
    (a, b) => (b.year || 0) - (a.year || 0)
  );

  return (
    <div data-testid="genre-detail-page">
      <section className="relative pt-40 sm:pt-48 pb-16 sm:pb-24 border-b border-white/10">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
          <Link
            href="/genres"
            className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white mb-10 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Genres</span>
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <span className="h-px w-12 bg-brand-gold" />
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500">
              {String(movies.length).padStart(2, "0")} films in the collection
            </p>
          </div>
          <h1 className="font-serif font-light text-white text-6xl sm:text-7xl lg:text-[8vw] leading-[0.88] tracking-[-0.02em]">
            {genre.name}
            <span className="text-brand-gold">.</span>
          </h1>
          <p className="mt-6 font-serif italic text-zinc-400 text-xl sm:text-2xl max-w-2xl">
            {genre.tagline}
          </p>
        </div>
      </section>

      <section className="relative py-16 sm:py-20">
        {movies.length === 0 ? (
          <p className="mx-6 sm:mx-10 font-serif italic text-zinc-500 text-lg">
            No {genre.name.toLowerCase()} films in the collection yet — check back soon.
          </p>
        ) : (
          <AuthGate label={`the full ${genre.name} collection`}>
            <div className="mx-auto max-w-[1600px] px-6 sm:px-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 lg:gap-6">
              {movies.map((m, i) => (
                <GenreMovieCard key={m.id} movie={m} priority={i < 5} />
              ))}
            </div>
          </AuthGate>
        )}
      </section>
    </div>
  );
}
