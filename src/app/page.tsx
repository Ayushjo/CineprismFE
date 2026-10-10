import { getLatestReviews, getTopPicks, getPostById, getQuotes } from "@/lib/api";
import { postToReview, topPickToCard } from "@/lib/adapters";
import Hero from "@/components/site/Hero";
import Ticker from "@/components/site/Ticker";
import FeaturedReview from "@/components/site/FeaturedReview";
import TopPicksSection from "@/components/site/TopPicksSection";
import GenresSection from "@/components/site/GenresSection";
import RecentReviews from "@/components/site/RecentReviews";
import QuoteBand from "@/components/site/QuoteBand";
import NewsletterCTA from "@/components/site/NewsletterCTA";
import JsonLd from "@/components/seo/JsonLd";
import { websiteJsonLd } from "@/lib/jsonld";

export const revalidate = 300;

export default async function Home() {
  const [posts, topPicksRaw, quotes] = await Promise.all([
    getLatestReviews(),
    getTopPicks(),
    getQuotes(),
  ]);

  // Rotate the featured quote daily so the home page feels alive.
  const quote =
    quotes.length > 0
      ? quotes[Math.floor(Date.now() / 86400000) % quotes.length]
      : null;

  const reviews = posts.map(postToReview);
  const picks = topPicksRaw.map(topPickToCard);

  // Enrich the featured review with its gallery (latest-reviews omits images).
  const featuredPost = posts[0] ? await getPostById(posts[0].id) : null;
  const featured = featuredPost ? postToReview(featuredPost) : reviews[0] ?? null;

  const nowPlaying = featured ? { title: featured.title } : undefined;

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <Hero nowPlaying={nowPlaying} />
      <Ticker />
      <FeaturedReview review={featured} />
      <TopPicksSection picks={picks} />
      <QuoteBand quote={quote} />
      <GenresSection />
      <RecentReviews reviews={reviews} />
      <NewsletterCTA />
    </>
  );
}
