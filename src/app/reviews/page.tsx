import type { Metadata } from "next";
import { getAllPosts } from "@/lib/api";
import { postToReview } from "@/lib/adapters";
import { buildMetadata } from "@/lib/seo";
import ReviewsBrowser from "@/components/site/ReviewsBrowser";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Reviews",
  description:
    "The complete archive of film reviews from The Cinéprism — close-readings of cinema, sorted by most recent.",
  path: "/reviews",
});

export default async function ReviewsPage() {
  const posts = await getAllPosts();
  const reviews = posts.map(postToReview);

  return (
    <div data-testid="reviews-page">
      {/* Page header */}
      <section className="relative pt-40 sm:pt-48 pb-16 sm:pb-24 border-b border-white/10">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-brand-gold" />
          </div>
          <h1
            data-testid="reviews-page-title"
            className="font-serif font-light text-white text-6xl sm:text-7xl lg:text-[9vw] leading-[0.88] tracking-[-0.02em]"
          >
            Reviews
            <span className="italic text-zinc-500">, close-read</span>
            <span className="text-brand-gold">.</span>
          </h1>
        </div>
      </section>

      {/* Search / filter / sort + contact-sheet grid */}
      <section className="relative py-16 sm:py-20">
        {reviews.length === 0 ? (
          <p className="mx-6 sm:mx-10 font-mono text-sm text-zinc-500">
            No reviews published yet.
          </p>
        ) : (
          <ReviewsBrowser reviews={reviews} />
        )}
      </section>
    </div>
  );
}
