import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { getArticles, getArticleBySlug } from "@/lib/api";
import { blocksToPlainText } from "@/lib/adapters";
import { buildMetadata, absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";
import { editorialDate, readingTime, truncate } from "@/lib/utils";
import BlockRenderer from "@/components/content/BlockRenderer";
import ShareButton from "@/components/content/ShareButton";
import AuthGate from "@/components/site/AuthGate";
import ArticleCard from "@/components/site/ArticleCard";
import JsonLd from "@/components/seo/JsonLd";
import { articleJsonLd } from "@/lib/jsonld";

export const revalidate = 600;
export const dynamicParams = true;

type Params = { slug: string };

function initials(name: string): string {
  if (!name) return "C";
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] ?? "") + (p.length > 1 ? p[p.length - 1][0] : "")).toUpperCase();
}

// Pre-render every article at build time for the fastest, most crawlable pages.
export async function generateStaticParams(): Promise<Params[]> {
  try {
    const articles = await getArticles();
    return articles.filter((a) => a.slug).map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return buildMetadata({ title: "Article not found", path: `/articles/${slug}` });

  const description =
    article.shortDescription ||
    truncate(blocksToPlainText(article.blocks), 160) ||
    `An essay from ${SITE_NAME}.`;

  return buildMetadata({
    title: article.title,
    description,
    path: `/articles/${article.slug}`,
    image: article.mainImageUrl,
    type: "article",
    publishedTime: article.publishedAt || article.createdAt,
    authors: [article.author || SITE_NAME],
  });
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const plain = blocksToPlainText(article.blocks);
  const date = editorialDate(article.publishedAt || article.createdAt);
  const minutes = readingTime(plain);
  const shareUrl = absoluteUrl(`/articles/${article.slug}`);

  const others = (await getArticles())
    .filter((a) => a.slug !== article.slug && a.published !== false)
    .slice(0, 2);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${SITE_URL}/articles` },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: shareUrl,
      },
    ],
  };

  return (
    <article data-testid="article-detail-page">
      <JsonLd data={articleJsonLd(article, `/articles/${article.slug}`, plain)} />
      <JsonLd data={breadcrumb} />

      {/* Hero */}
      <header className="relative pt-32 sm:pt-40 pb-14 sm:pb-20">
        <div className="mx-auto max-w-4xl px-6 sm:px-10">
          <Link
            href="/articles"
            className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white mb-10 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Articles</span>
          </Link>

          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold mb-6">
            Dispatch — Long Read
          </p>

          <h1 className="font-serif font-light text-white text-5xl sm:text-6xl lg:text-7xl leading-[0.92] tracking-[-0.02em] mb-8">
            {article.title}
          </h1>

          {article.shortDescription ? (
            <p className="font-serif italic text-zinc-300 text-xl sm:text-2xl leading-relaxed max-w-3xl mb-10">
              {article.shortDescription}
            </p>
          ) : null}

          {/* Byline */}
          <div className="flex flex-wrap items-center justify-between gap-6 border-t border-b border-white/10 py-5">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-10 w-10 items-center justify-center border border-white/30 font-serif italic text-lg text-white">
                {initials(article.author)}
              </span>
              <div>
                <p className="font-serif italic text-white text-base">
                  {article.author || SITE_NAME}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 mt-0.5">
                  {date} · {minutes}
                </p>
              </div>
            </div>
            <ShareButton title={article.title} url={shareUrl} variant="icon" />
          </div>
        </div>
      </header>

      {/* Lead image */}
      {article.mainImageUrl ? (
        <div className="mx-auto max-w-[72rem] px-6 sm:px-10 mb-14 sm:mb-20">
          <div className="relative aspect-[2.35/1] overflow-hidden border border-white/10 bg-surface">
            <Image
              src={article.mainImageUrl}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1152px"
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      {/* Body — readable text column, images break out wider (see .article-grid) */}
      <div className="mx-auto max-w-[72rem] px-6 sm:px-10">
        {article.blocks?.length ? (
          <AuthGate label="the full article">
            <BlockRenderer blocks={article.blocks} />
          </AuthGate>
        ) : (
          <p className="mx-auto max-w-[46rem] font-mono text-sm text-zinc-500">
            This article has no content yet.
          </p>
        )}

        {/* Signature + share */}
        <div className="mx-auto max-w-[46rem] mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/10 pt-10">
          <div className="flex items-center gap-4">
            <span className="h-px w-16 bg-white/30" />
            <p className="font-serif italic text-zinc-500 text-lg">— {article.author || SITE_NAME}</p>
          </div>
          <ShareButton title={article.title} url={shareUrl} />
        </div>
      </div>

      {/* More articles */}
      {others.length > 0 && (
        <section className="border-t border-white/10 mt-20 sm:mt-28 py-20 sm:py-24">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10">
            <div className="flex items-center gap-4 mb-10">
              <span className="h-px w-10 bg-white/40" />
              <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-zinc-500">
                Keep reading
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {others.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
