"use client";

import { useEffect, useState } from "react";

type BlockType = "PARAGRAPH" | "HEADING" | "IMAGE" | "LIST" | "QUOTE" | "DIVIDER";
export type PreviewBlock = {
  id: string; type: BlockType;
  text?: string; level?: number; author?: string;
  ordered?: boolean; items?: string[];
  caption?: string; alt?: string; file?: File | null;
};

function useObjectUrl(file: File | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) { setUrl(null); return; }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  return url;
}

function ImageBlock({ file, caption }: { file: File | null | undefined; caption?: string }) {
  const url = useObjectUrl(file);
  if (!url) return <div className="my-12 md:my-16 aspect-video grid place-items-center border border-dashed border-white/15 text-zinc-600 font-mono text-xs">image</div>;
  return (
    <figure className="article-breakout my-12 md:my-16">
      <div className="relative aspect-video overflow-hidden border border-white/10 bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={caption || ""} className="h-full w-full object-cover" />
      </div>
      {caption ? <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 text-center">{caption}</figcaption> : null}
    </figure>
  );
}

export default function ArticlePreview({
  title, deck, author, mainImage, blocks,
}: {
  title: string; deck: string; author: string; mainImage: File | null; blocks: PreviewBlock[];
}) {
  const mainUrl = useObjectUrl(mainImage);
  let firstParaSeen = false;

  return (
    <div className="bg-ink text-white rounded-lg overflow-hidden border border-slate-800">
      <article className="pb-16">
        {/* Hero */}
        <header className="px-6 sm:px-10 pt-14 pb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold mb-6">Dispatch — Long Read</p>
          <h1 className="font-serif font-light text-white text-4xl sm:text-5xl leading-[0.95] tracking-[-0.02em] mb-6">
            {title || "Untitled article"}
          </h1>
          {deck ? <p className="font-serif italic text-zinc-300 text-lg sm:text-xl leading-relaxed max-w-3xl mb-8">{deck}</p> : null}
          <div className="flex items-center gap-4 border-t border-b border-white/10 py-4">
            <span className="inline-flex h-9 w-9 items-center justify-center border border-white/30 font-serif italic text-white uppercase">
              {(author || "C").trim().charAt(0)}
            </span>
            <div>
              <p className="font-serif italic text-white text-sm">{author || "The Cinéprism"}</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 mt-0.5">Preview · Draft</p>
            </div>
          </div>
        </header>

        {/* Lead image */}
        {mainUrl ? (
          <div className="px-6 sm:px-10 mb-12">
            <div className="relative aspect-[2.35/1] overflow-hidden border border-white/10 bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mainUrl} alt="" className="h-full w-full object-cover" />
            </div>
          </div>
        ) : null}

        {/* Body */}
        <div className="px-6 sm:px-10">
          <div className="article-grid">
            {blocks.map((b) => {
              if (b.type === "PARAGRAPH") {
                const first = !firstParaSeen; firstParaSeen = true;
                if (!b.text) return null;
                return (
                  <p key={b.id} className={`font-serif text-lg leading-[1.8] text-zinc-300 mb-8 ${first ? "first-letter:font-serif first-letter:text-6xl first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.9] first-letter:text-white" : ""}`}>
                    {b.text}
                  </p>
                );
              }
              if (b.type === "HEADING") {
                if (!b.text) return null;
                const Tag = `h${Math.min(6, Math.max(2, b.level || 2))}` as "h2";
                return <Tag key={b.id} className="font-serif font-light text-white text-2xl sm:text-3xl leading-tight tracking-tight mt-12 mb-5">{b.text}</Tag>;
              }
              if (b.type === "IMAGE") return <ImageBlock key={b.id} file={b.file} caption={b.caption} />;
              if (b.type === "LIST") {
                const items = (b.items || []).filter(Boolean);
                if (!items.length) return null;
                const Tag = b.ordered ? "ol" : "ul";
                return <Tag key={b.id} className={`mb-8 space-y-3 font-serif text-lg text-zinc-300 ${b.ordered ? "list-decimal" : "list-disc"} pl-6 marker:text-gold`}>{items.map((it, i) => <li key={i}>{it}</li>)}</Tag>;
              }
              if (b.type === "QUOTE") {
                if (!b.text) return null;
                return (
                  <blockquote key={b.id} className="my-12 border-l-2 border-gold pl-6">
                    <p className="font-serif italic text-2xl leading-snug text-white">&ldquo;{b.text}&rdquo;</p>
                    {b.author ? <cite className="mt-4 block font-mono text-[10px] not-italic uppercase tracking-[0.28em] text-zinc-500">— {b.author}</cite> : null}
                  </blockquote>
                );
              }
              if (b.type === "DIVIDER") return <hr key={b.id} className="my-14 border-0 h-px bg-white/10" />;
              return null;
            })}
          </div>
        </div>
      </article>
    </div>
  );
}
