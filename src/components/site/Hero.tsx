"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { heroImage } from "@/lib/media";

type NowPlaying = { title: string; director: string } | null;
type LatestItem = { slug: string; title: string; director: string; year: number };

export default function Hero({
  nowPlaying,
  latest = [],
}: {
  nowPlaying?: NowPlaying;
  latest?: LatestItem[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const np = nowPlaying ?? { title: "In The Mood For Love", director: "Wong Kar-wai" };

  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative w-full min-h-[100svh] overflow-hidden bg-ink"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-[transform,opacity,filter] duration-[2200ms] ease-film ${
            mounted ? "opacity-70 scale-100 blur-0" : "opacity-0 scale-105 blur-md"
          }`}
          style={{ filter: "grayscale(35%) contrast(1.05)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />
        <div className="absolute inset-0 bg-ink/30" />
      </div>

      {/* Top meta */}
      <div className="absolute top-24 left-6 right-6 sm:left-10 sm:right-10 z-10 flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-zinc-600" />
          <span>Vol. 04 · Reel 12</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>A Journal of Serious Film</span>
          <span className="h-px w-6 bg-zinc-600" />
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 mx-auto max-w-[1600px] px-6 sm:px-10 pt-40 sm:pt-48 lg:pt-56 pb-32 min-h-[100svh] flex flex-col justify-between">
        <div>
          <div className={`overflow-hidden transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-gold mb-6 sm:mb-8">
              — A Journal of Serious Film
            </p>
          </div>
          <h1
            data-testid="hero-title"
            className={`font-serif font-light text-white leading-[0.85] tracking-[-0.02em] uppercase text-[18vw] sm:text-[13vw] lg:text-[9.5vw] transition-all duration-[1400ms] ease-film ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span className="block">The</span>
            <span className="block italic font-extralight text-white/95 -mt-2 sm:-mt-4">
              Ciné<span className="text-brand-gold">prism</span>
            </span>
          </h1>

          <div className={`mt-10 sm:mt-14 max-w-xl transition-all duration-1000 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <p className="font-mono text-sm sm:text-base leading-relaxed text-zinc-300">
              Reviews, essays and quiet obsessions from a lifetime spent in the dark.
              Not criticism as verdict — criticism as <span className="text-white">devotion</span>.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 sm:mt-32 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-10">
          <a
            href="#featured"
            className="group hidden sm:flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white transition-colors"
          >
            <span className="relative flex h-8 w-[1px] bg-zinc-600 overflow-hidden">
              <span className="absolute inset-x-0 top-0 h-3 bg-white animate-scrolldown" />
            </span>
            <span>Scroll — Enter the theatre</span>
          </a>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-1">Now Playing</p>
              <p className="font-serif italic text-white text-lg sm:text-xl">{np.title}</p>
            </div>
            <div className="h-14 w-[1px] bg-white/15" aria-hidden="true" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500 mb-1">Directed</p>
              <p className="font-serif text-white text-lg sm:text-xl">{np.director}</p>
            </div>
          </div>
        </div>
      </div>

      {/* The Latest — fills the right negative space (large screens) */}
      {latest.length > 0 && (
        <div
          className={`hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 z-10 w-[300px] xl:w-[320px] transition-all duration-1000 delay-700 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
          }`}
        >
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-5">
            <span className="h-px w-8 bg-brand-gold" />
            The Latest
          </p>
          <div className="border-t border-white/15">
            {latest.map((r, i) => (
              <Link
                key={r.slug}
                href={`/reviews/${r.slug}`}
                data-testid={`hero-latest-${i}`}
                className="group flex items-center gap-5 py-4 border-b border-white/15"
              >
                <span className="font-mono text-[10px] text-zinc-500 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-white text-lg leading-tight truncate group-hover:text-brand-gold transition-colors">
                    {r.title}
                  </h3>
                  <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-zinc-500 mt-1 truncate">
                    {r.director} · {r.year}
                  </p>
                </div>
                <span className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="hidden sm:block pointer-events-none absolute top-0 left-10 h-full w-px bg-white/5" />
      <div className="hidden sm:block pointer-events-none absolute top-0 right-10 h-full w-px bg-white/5" />
    </section>
  );
}
