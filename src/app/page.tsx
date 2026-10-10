import { getAllPosts, getLatestReviews, getTopPicks, getPostById, getQuotes } from "@/lib/api";
import { postToReview, reviewSlug, topPickToCard } from "@/lib/adapters";
import { dailyIndex, istDay } from "@/lib/utils";
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
  const [posts, topPicksRaw, quotes, allPosts] = await Promise.all([
    getLatestReviews(),
    getTopPicks(),
    getQuotes(),
    getAllPosts().catch(() => []),
  ]);

  // Daily rotations (quote + Tonight's Pick) change at midnight IST.
  const today = istDay();
  const quote = quotes.length > 0 ? quotes[today % quotes.length] : null;

  const reviews = posts.map(postToReview);
  const picks = topPicksRaw.map(topPickToCard);

  // Enrich the featured review with its gallery (latest-reviews omits images).
  const featuredPost = posts[0] ? await getPostById(posts[0].id) : null;
  const featured = featuredPost ? postToReview(featuredPost) : reviews[0] ?? null;

  // Tonight's Pick: one Top Pick a day. Link to our review if we've written one.
  const pick = picks.length > 0 ? picks[dailyIndex(today, picks.length)] : null;
  const titleKey = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const reviewed = pick
    ? allPosts.find((p) => p.year === pick.year && titleKey(p.title) === titleKey(pick.title))
    : undefined;
  const tonightsPick = pick
    ? {
        title: pick.title,
        year: pick.year,
        byline: pick.director || pick.genre || null,
        href: reviewed ? `/reviews/${reviewSlug(reviewed)}` : "/top-picks",
      }
    : null;

  return (
    <>
      <JsonLd data={websiteJsonLd()} />
      <Hero tonightsPick={tonightsPick} />
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
