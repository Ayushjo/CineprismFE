"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { heroImage } from "@/lib/media";

type NowPlaying = { title: string } | null;

export default function Hero({ nowPlaying }: { nowPlaying?: NowPlaying }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const title = nowPlaying?.title ?? "In The Mood For Love";

  return (
    <section
      id="top"
      data-testid="hero-section"
      className="relative w-full min-h-[100svh] overflow-hidden bg-ink"
    >
      {/* Full-bleed cinematic backdrop */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-[transform,opacity,filter] duration-[2200ms] ease-film ${
            mounted ? "opacity-60 scale-100 blur-0" : "opacity-0 scale-105 blur-md"
          }`}
          style={{ filter: "grayscale(45%) contrast(1.1) brightness(0.75)" }}
        />
        {/* Soft vignette — keeps brand readable without a left wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.35)_45%,rgba(10,10,10,0.92)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/55" />
      </div>

      {/* Centered composition: brand as the whole first viewport */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1600px] flex-col items-center justify-center px-6 sm:px-10 pt-24 pb-20 text-center">
        <h1
          data-testid="hero-title"
          className={`leading-[0.88] tracking-[-0.02em] text-white transition-all duration-[1400ms] ease-film ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="block font-serif font-light uppercase text-[14vw] sm:text-[11vw] lg:text-[9vw]">
            The
          </span>
          <span className="block font-display italic font-normal text-[16vw] sm:text-[12vw] lg:text-[10vw] -mt-1 sm:-mt-3 text-white/95">
            Ciné<span className="text-brand-gold">prism</span>
          </span>
        </h1>

        <p
          className={`mt-8 sm:mt-10 max-w-xl font-display italic text-lg sm:text-xl md:text-2xl leading-relaxed text-zinc-300 transition-all duration-1000 delay-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          Good films make your life better
        </p>

        <div
          className={`mt-14 sm:mt-16 transition-all duration-1000 delay-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-zinc-500 mb-2">
            Now Playing
          </p>
          <a
            href="#featured"
            className="font-serif italic text-white text-xl sm:text-2xl hover:text-brand-gold transition-colors"
          >
            {title}
          </a>
        </div>
      </div>
    </section>
  );
}
