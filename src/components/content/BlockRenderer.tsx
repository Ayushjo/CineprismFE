import Image from "next/image";
import type { ContentBlock } from "@/types/content";

type ParagraphC = { text?: string };
type HeadingC = { level?: number; text?: string };
type ImageC = { url?: string; caption?: string };
type ListC = { type?: string; items?: string[] };
type QuoteC = { text?: string; author?: string };

function Paragraph({ c, first }: { c: ParagraphC; first: boolean }) {
  if (!c.text) return null;
  return (
    <p
      className={`font-serif text-lg sm:text-xl leading-[1.8] text-zinc-300 mb-8 ${
        first
          ? "first-letter:font-serif first-letter:text-6xl sm:first-letter:text-7xl first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.9] first-letter:text-white"
          : ""
      }`}
    >
      {c.text}
    </p>
  );
}

function Heading({ c }: { c: HeadingC }) {
  if (!c.text) return null;
  const level = Math.min(6, Math.max(2, c.level ?? 2));
  const Tag = `h${level}` as "h2" | "h3" | "h4" | "h5" | "h6";
  const sizes: Record<number, string> = {
    2: "text-3xl sm:text-4xl",
    3: "text-2xl sm:text-3xl",
    4: "text-xl sm:text-2xl",
    5: "text-lg sm:text-xl",
    6: "text-base sm:text-lg uppercase tracking-[0.15em]",
  };
  return (
    <Tag className={`font-serif font-light text-white leading-tight tracking-tight mt-14 mb-6 ${sizes[level]}`}>
      {c.text}
    </Tag>
  );
}

function BlockImage({ c }: { c: ImageC }) {
  if (!c.url) return null;
  return (
    <figure className="my-12">
      <div className="relative aspect-video overflow-hidden border border-white/10 bg-surface">
        <Image
          src={c.url}
          alt={c.caption || ""}
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          className="object-cover"
        />
      </div>
      {c.caption ? (
        <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
          {c.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function BlockList({ c }: { c: ListC }) {
  const items = c.items ?? [];
  if (!items.length) return null;
  const ordered = c.type === "numbered";
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={`mb-8 space-y-3 font-serif text-lg sm:text-xl leading-relaxed text-zinc-300 ${
        ordered ? "list-decimal" : "list-disc"
      } pl-6 marker:text-gold`}
    >
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  );
}

function BlockQuote({ c }: { c: QuoteC }) {
  if (!c.text) return null;
  return (
    <blockquote className="my-12 border-l-2 border-gold pl-6 sm:pl-8">
      <p className="font-serif italic text-2xl sm:text-3xl leading-snug text-white">
        &ldquo;{c.text}&rdquo;
      </p>
      {c.author ? (
        <cite className="mt-4 block font-mono text-[10px] not-italic uppercase tracking-[0.28em] text-zinc-500">
          — {c.author}
        </cite>
      ) : null}
    </blockquote>
  );
}

export default function BlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  const ordered = [...(blocks ?? [])].sort((a, b) => a.order - b.order);
  let firstParagraphSeen = false;

  return (
    <div className="article-body">
      {ordered.map((block) => {
        switch (block.type) {
          case "PARAGRAPH": {
            const first = !firstParagraphSeen;
            firstParagraphSeen = true;
            return <Paragraph key={block.id} c={block.content as ParagraphC} first={first} />;
          }
          case "HEADING":
            return <Heading key={block.id} c={block.content as HeadingC} />;
          case "IMAGE":
            return <BlockImage key={block.id} c={block.content as ImageC} />;
          case "LIST":
            return <BlockList key={block.id} c={block.content as ListC} />;
          case "QUOTE":
            return <BlockQuote key={block.id} c={block.content as QuoteC} />;
          case "DIVIDER":
            return (
              <hr key={block.id} className="my-14 border-0 h-px bg-white/10" />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
