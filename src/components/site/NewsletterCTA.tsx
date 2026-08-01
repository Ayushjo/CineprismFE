"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { theaterImage } from "@/lib/media";

export default function NewsletterCTA() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    // Route into the real subscription flow, carrying the address.
    router.push(value ? `/newsletter?email=${encodeURIComponent(value)}` : "/newsletter");
  };

  return (
    <section id="newsletter" data-testid="newsletter-section" className="relative bg-ink border-t border-white/5 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={theaterImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
          style={{ filter: "grayscale(70%) contrast(1.1)" }}
        />
        <div className="absolute inset-0 bg-ink/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 sm:px-10 py-28 sm:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-px w-12 bg-brand-gold" />
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-400">The Dispatch</p>
            </div>
            <h2 className="font-serif font-light text-white text-5xl sm:text-6xl lg:text-7xl leading-[0.9] tracking-tight mb-8">
              The Cinéprism<span className="italic text-brand-gold"> Weekly</span>.
            </h2>
            <p className="font-mono text-sm sm:text-base leading-relaxed text-zinc-300 max-w-lg mb-8">
              Deep dives, honest reviews, and curated film picks — delivered every Friday.
              Written for people who take cinema seriously.
            </p>
            <Link
              href="/newsletter"
              className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-brand-gold hover:text-white border-b border-brand-gold/50 hover:border-white pb-2 transition-colors"
            >
              <span>See what&rsquo;s inside — Reserve a seat</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="lg:col-span-5">
            <form onSubmit={submit} data-testid="newsletter-form" className="relative">
              <label htmlFor="newsletter-email" className="block font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4">
                — Your correspondence
              </label>
              <div className="flex items-center border-b border-white/30 focus-within:border-white transition-colors py-2">
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.dark"
                  className="flex-1 min-w-0 bg-transparent font-serif text-2xl sm:text-3xl text-white placeholder:text-zinc-600 focus:outline-none py-2"
                />
                <button
                  type="submit"
                  className="ml-4 shrink-0 font-mono text-[10px] uppercase tracking-[0.32em] text-white bg-white/10 hover:bg-white hover:text-black border border-white/30 hover:border-white px-5 py-3 transition-colors duration-300"
                >
                  Subscribe →
                </button>
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
                No spam. Unsubscribe at any dissolve.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
