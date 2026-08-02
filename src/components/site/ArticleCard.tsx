import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/content";
import { editorialDate } from "@/lib/utils";

function initials(name: string): string {
  if (!name) return "C";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "");
}

export default function ArticleCard({
  article,
  featured = false,
  priority = false,
}: {
  article: Article;
  featured?: boolean;
  priority?: boolean;
}) {
  const date = editorialDate(article.publishedAt || article.createdAt);
  return (
    <Link
      href={`/articles/${article.slug}`}
      data-testid={`article-card-${article.slug}`}
      className={`group relative block overflow-hidden border border-white/10 hover:border-white/30 transition-colors duration-500 ${
        featured ? "lg:col-span-2" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? "aspect-[2.35/1]" : "aspect-[16/10]"}`}>
        {article.mainImageUrl ? (
          <Image
            src={article.mainImageUrl}
            alt={article.title}
            fill
            sizes={featured ? "(max-width: 1024px) 100vw, 1024px" : "(max-width: 1024px) 100vw, 512px"}
            priority={priority}
            className="object-cover film-still scale-[1.03] group-hover:scale-100"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-surface">
            <span className="font-serif italic text-zinc-700 text-2xl px-8 text-center">
              {article.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
      </div>

      <div className={`p-6 sm:p-8 ${featured ? "lg:p-10" : ""}`}>
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-3">
          {date}
          {article.viewCount ? ` · ${article.viewCount} reads` : ""}
        </p>
        <h3
          className={`font-serif font-light text-white leading-tight tracking-tight mb-4 ${
            featured ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl"
          }`}
        >
          {article.title}
        </h3>
        {article.shortDescription ? (
          <p className="font-serif italic text-zinc-400 leading-relaxed line-clamp-3 text-base sm:text-lg">
            {article.shortDescription}
          </p>
        ) : null}

        <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-7 w-7 items-center justify-center border border-white/30 font-serif italic text-sm text-white uppercase">
              {initials(article.author)}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-400">
              {article.author || "The Cinéprism"}
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 group-hover:text-white transition-colors">
            Read →
          </span>
        </div>
      </div>
    </Link>
  );
}
