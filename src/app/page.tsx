import { getLatestReviews, getArticles, getTopPicks, getPostById } from "@/lib/api";
import { postToReview, topPickToCard } from "@/lib/adapters";
import Hero from "@/components/site/Hero";
import Ticker from "@/components/site/Ticker";
import FeaturedReview from "@/components/site/FeaturedReview";
import TopPicksSection from "@/components/site/TopPicksSection";
import GenresSection from "@/components/site/GenresSection";
import RecentReviews from "@/components/site/RecentReviews";
import NewsletterCTA from "@/components/site/NewsletterCTA";
import JsonLd from "@/components/seo/JsonLd";
import { websiteJsonLd } from "@/lib/jsonld";

export const revalidate = 300;

export default async function Home() {
  const [posts, articles, topPicksRaw] = await Promise.all([
    getLatestReviews(),
    getArticles().catch(() => []),
    getTopPicks(),
  ]);

  const reviews = posts.map(postToReview);
  const picks = topPicksRaw.map(topPickToCard);

  // Enrich the featured review with its gallery (latest-reviews omits images).
  const featuredPost = posts[0] ? await getPostById(posts[0].id) : null;
  const featured = featuredPost ? postToReview(featuredPost) : reviews[0] ?? null;

  // Slim "The Latest" index for the hero right column.
  const latest = reviews.slice(0, 4).map((r) => ({
    slug: r.slug,
    title: r.title,
    director: r.director,
    year: r.year,
  }));

  // Ticker: mix latest review + article titles for a live editorial feel.
  const tickerItems = [
    "Latest Dispatch",
    ...reviews.slice(0, 3).map((r) => r.title),
    "Just Published",
    ...articles.slice(0, 2).map((a) => a.title),
    "A Journal of Serious Film",
  ];

  const nowPlaying = featured
    ? { title: featured.title, director: featured.director }
    : undefined;

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <Hero nowPlaying={nowPlaying} latest={latest} />
      <Ticker items={tickerItems} />
      <FeaturedReview review={featured} />
      <TopPicksSection picks={picks} />
      <GenresSection />
      <RecentReviews reviews={reviews} />
      <NewsletterCTA />
    </>
  );
}
