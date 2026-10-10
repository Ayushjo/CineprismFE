import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getPostById, getRelatedPosts } from "@/lib/api";
import { idFromSlug, postToReview, reviewSlug } from "@/lib/adapters";
import { buildMetadata, absoluteUrl } from "@/lib/seo";
import { truncate } from "@/lib/utils";
import ReviewBody from "@/components/content/ReviewBody";
import RatingBreakdown from "@/components/content/RatingBreakdown";
import ReviewGallery from "@/components/content/ReviewGallery";
import ShareButton from "@/components/content/ShareButton";
import AuthGate from "@/components/site/AuthGate";
import JsonLd from "@/components/seo/JsonLd";
import { reviewJsonLd } from "@/lib/jsonld";

export const revalidate = 300;

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostById(idFromSlug(slug));
  if (!post) return buildMetadata({ title: "Review not found", path: `/reviews/${slug}` });

  const review = postToReview(post);
  const description = truncate(review.body[0] || `A review of ${review.title}.`, 160);
  return buildMetadata({
    title: `${review.title} (${review.year}) — Review`,
    description,
    path: `/reviews/${review.slug}`,
    image: review.image,
    type: "article",
    publishedTime: review.createdAt,
    authors: ["The Cinéprism"],
    tags: review.genres,
  });
}

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPostById(idFromSlug(slug));
  if (!post) notFound();

  // Canonical slug: redirect legacy/id-only links to the pretty URL (SEO).
  const canonical = reviewSlug(post);
  if (slug !== canonical) redirect(`/reviews/${canonical}`);

  const review = postToReview(post);
  const related = (await getRelatedPosts(post.id)).map(postToReview).slice(0, 3);
  const shareUrl = absoluteUrl(`/reviews/${review.slug}`);
  // Canonical URL stays for SEO/JSON-LD; humans share the short link.
  const shortShareUrl = review.shortId
    ? absoluteUrl(`/s/${review.shortId}`)
    : shareUrl;

  return (
    <div data-testid="review-detail-page">
      <JsonLd data={reviewJsonLd(review, `/reviews/${review.slug}`)} />
      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10">
          <Link
            href="/reviews"
            className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white mb-12 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Reviews</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            {/* Poster */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[3/4] overflow-hidden bg-surface border border-white/10">
                {review.poster || review.backdrop ? (
                  <Image
                    src={(review.poster || review.backdrop) as string}
                    alt={review.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
                Still — {review.title} ({review.year})
              </p>
            </div>

            {/* Meta + title */}
            <div className="lg:col-span-7 lg:pt-4">
              {review.genres.length > 0 && (
                <div className="flex items-center gap-3 mb-6 flex-wrap">
                  {review.genres.map((g) => (
                    <span
                      key={g}
                      className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 border border-white/15 px-3 py-1"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="font-serif font-light text-white text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-[-0.02em] mb-8">
                {review.title}
                <span className="text-brand-gold">.</span>
              </h1>

              {review.tagline ? (
                <p className="font-serif italic text-zinc-300 text-xl sm:text-2xl leading-relaxed mb-10 max-w-2xl">
                  {review.tagline}
                </p>
              ) : null}

              {/* Meta grid */}
              <dl className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-6 border-t border-white/10 pt-6 mb-10 font-mono text-[11px]">
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
                  {review.streamingFromJustWatch ? (
                    <dd className="mt-1 text-[9px] uppercase tracking-[0.2em] text-zinc-600">via JustWatch</dd>
                  ) : null}
                </div>
              </dl>

              <ShareButton title={`${review.title} (${review.year}) — The Cinéprism`} url={shortShareUrl} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-6 sm:mx-10 border-t border-white/10" />

      {/* Body */}
      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold mb-10">
            — The Review
          </p>
          <AuthGate label="the full review">
            <ReviewBody body={review.body} />
            {review.rating.length > 0 && <RatingBreakdown rating={review.rating} className="mt-16" />}
          </AuthGate>

          {/* Signature + bottom share */}
          <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/10 pt-10">
            <div className="flex items-center gap-4">
              <span className="h-px w-16 bg-white/30" />
              <p className="font-serif italic text-zinc-500 text-lg">— The Cinéprism</p>
            </div>
            <ShareButton
              title={`${review.title} (${review.year}) — The Cinéprism`}
              url={shortShareUrl}
              variant="icon"
            />
          </div>
        </div>
      </section>

      {/* Gallery */}
      <ReviewGallery images={review.gallery} title={review.title} />

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-white/10 py-20 sm:py-28">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="h-px w-10 bg-white/40" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500">
                    Also on the marquee
                  </p>
                </div>
                <h2 className="font-serif font-light text-white text-3xl sm:text-4xl">
                  More <span className="italic text-zinc-400">reviews</span>.
                </h2>
              </div>
              <Link
                href="/reviews"
                className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-colors"
              >
                All Reviews →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/reviews/${r.slug}`}
                  className="group block border border-white/10 p-6 hover:border-white/30 transition-colors"
                >
                  <div className="relative aspect-video overflow-hidden mb-5 bg-surface">
                    {r.backdrop || r.poster ? (
                      <Image
                        src={(r.backdrop || r.poster) as string}
                        alt={r.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover film-still"
                      />
                    ) : null}
                  </div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-2">
                    {r.director} · {r.year}
                  </p>
                  <h3 className="font-serif text-white text-xl sm:text-2xl leading-tight mb-2">
                    {r.title}
                  </h3>
                  {r.tagline ? (
                    <p className="font-serif italic text-zinc-500 text-sm line-clamp-2">{r.tagline}</p>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
