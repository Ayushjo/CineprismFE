import type { Metadata } from "next";
import { getArticles } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import ArticleCard from "@/components/site/ArticleCard";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Articles",
  description:
    "Long-form dispatches from The Cineprism — essays, listicles, obituaries and love letters to cinema.",
  path: "/articles",
});

export default async function ArticlesPage() {
  const articles = (await getArticles()).filter((a) => a.published !== false);
  const [first, ...rest] = articles;

  return (
    <div data-testid="articles-page">
      {/* Hero */}
      <section className="relative pt-40 sm:pt-48 pb-16 sm:pb-24 border-b border-white/10">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-brand-gold" />
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500">
              Long-form dispatches
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
            <h1
              data-testid="articles-page-title"
              className="font-serif font-light text-white text-6xl sm:text-7xl lg:text-[9vw] leading-[0.88] tracking-[-0.02em]"
            >
              Articles
              <span className="text-brand-gold">.</span>
            </h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500 lg:text-right max-w-xs">
              {String(articles.length).padStart(3, "0")} pieces on file —
              <br />
              Essays, listicles, obituaries, love letters.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="relative py-16 sm:py-20">
        {articles.length === 0 ? (
          <p className="mx-6 sm:mx-10 font-mono text-sm text-zinc-500">
            No articles published yet.
          </p>
        ) : (
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {first && <ArticleCard article={first} featured priority />}
            {rest.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
