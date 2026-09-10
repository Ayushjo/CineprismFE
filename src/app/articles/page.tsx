import type { Metadata } from "next";
import { getArticles } from "@/lib/api";
import { buildMetadata } from "@/lib/seo";
import ArticlesBrowser from "@/components/site/ArticlesBrowser";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Articles",
  description:
    "Long-form dispatches from The Cinéprism — essays, listicles, obituaries and love letters to cinema.",
  path: "/articles",
});

export default async function ArticlesPage() {
  const articles = (await getArticles()).filter((a) => a.published !== false);

  return (
    <div data-testid="articles-page">
      {/* Hero */}
      <section className="relative pt-40 sm:pt-48 pb-16 sm:pb-24 border-b border-white/10">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-brand-gold" />
          </div>
          <h1
            data-testid="articles-page-title"
            className="font-serif font-light text-white text-6xl sm:text-7xl lg:text-[9vw] leading-[0.88] tracking-[-0.02em]"
          >
            Articles
            <span className="text-brand-gold">.</span>
          </h1>
        </div>
      </section>

      {/* Search / sort + grid */}
      <section className="relative py-16 sm:py-20">
        {articles.length === 0 ? (
          <p className="mx-6 sm:mx-10 font-mono text-sm text-zinc-500">
            No articles published yet.
          </p>
        ) : (
          <ArticlesBrowser articles={articles} />
        )}
      </section>
    </div>
  );
}
