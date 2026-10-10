"use client";

import Marquee from "react-fast-marquee";

type TickerQuote = { text: string; author: string };

const QUOTES: TickerQuote[] = [
  { text: "Cinema is a matter of what's in the frame and what's out.", author: "Martin Scorsese" },
  { text: "The cinema is not a slice of life, but a piece of cake.", author: "Alfred Hitchcock" },
  { text: "If it can be written, or thought, it can be filmed.", author: "Stanley Kubrick" },
  { text: "A film is never really good unless the camera is an eye in the head of a poet.", author: "Orson Welles" },
  { text: "Cinema is the most beautiful fraud in the world.", author: "Jean-Luc Godard" },
];

export default function Ticker() {
  return (
    <div data-testid="ticker" className="relative border-y border-white/10 bg-ink" aria-hidden="true">
      <Marquee gradient={false} speed={38} className="py-4">
        {QUOTES.concat(QUOTES).map((q, i) => (
          <span key={i} className="mx-8 flex items-center gap-8 whitespace-nowrap">
            <span className={`font-mono text-[11px] ${i % 2 === 0 ? "text-gold" : "text-zinc-500"}`}>✦</span>
            <span className="flex items-baseline gap-3">
              <span className="font-serif italic text-base sm:text-lg text-zinc-200">
                &ldquo;{q.text}&rdquo;
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                — {q.author}
              </span>
            </span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
