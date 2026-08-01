"use client";

import Marquee from "react-fast-marquee";

const fallback = [
  "Latest Dispatch",
  "Criticism as devotion",
  "Now Screening",
  "A Journal of Serious Film",
  "Just Published",
  "Read the archive",
];

export default function Ticker({ items }: { items?: string[] }) {
  const list = items && items.length ? items : fallback;
  return (
    <div
      data-testid="ticker"
      className="relative border-y border-white/10 bg-ink"
      aria-hidden="true"
    >
      <Marquee gradient={false} speed={38} className="py-4">
        {list.concat(list).map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mx-8 font-mono text-[11px] uppercase tracking-[0.35em] text-zinc-400 flex items-center gap-8"
          >
            <span className={i % 2 === 0 ? "text-gold" : "text-zinc-500"}>✦</span>
            {item}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
