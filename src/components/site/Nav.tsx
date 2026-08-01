"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { label: "Reviews", to: "/reviews" },
  { label: "Top Picks", to: "/top-picks" },
  { label: "Genres", to: "/genres" },
  { label: "Articles", to: "/articles" },
  { label: "Weekly", to: "/newsletter" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);

  return (
    <header
      data-testid="site-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled
          ? "bg-black/70 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" data-testid="nav-logo" className="group flex items-center gap-3">
          <Image
            src="/thecineprismlogo.jpg"
            alt="The Cineprism"
            width={36}
            height={36}
            priority
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover ring-1 ring-white/20 shrink-0"
          />
          <span className="font-serif text-xl sm:text-2xl tracking-[0.02em] text-white leading-none">
            The<span className="italic font-light"> Cineprism</span>
          </span>
        </Link>

        {/* Center links */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.to}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
              className={`font-mono text-[11px] uppercase tracking-[0.25em] transition-colors duration-300 ${
                isActive(l.to) ? "text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <a
            href="https://x.com/TheCineprism"
            target="_blank"
            rel="noopener noreferrer"
            data-testid="nav-x-link"
            className="hidden lg:inline-flex font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400 hover:text-white transition-colors duration-300"
          >
            @TheCineprism ↗
          </a>
          <Link
            href="/auth"
            data-testid="nav-signin-btn"
            className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-300 hover:text-white transition-colors duration-300"
          >
            Sign In
          </Link>
          <Link
            href="/auth"
            data-testid="nav-subscribe-btn"
            className="inline-flex items-center gap-2 border border-white/20 hover:border-white bg-transparent px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
          >
            <span>Sign Up</span>
            <span aria-hidden="true">→</span>
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            data-testid="nav-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden flex flex-col gap-[5px] items-end w-8 h-8 justify-center"
          >
            <span className={`block h-px bg-white transition-all ${open ? "w-6 rotate-45 translate-y-[6px]" : "w-6"}`} />
            <span className={`block h-px bg-white transition-all ${open ? "opacity-0" : "w-4"}`} />
            <span className={`block h-px bg-white transition-all ${open ? "w-6 -rotate-45 -translate-y-[6px]" : "w-5"}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          data-testid="nav-mobile-menu"
          className="md:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl"
        >
          <nav className="px-6 py-6 flex flex-col gap-5">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.to}
                className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-300 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/auth"
              className="font-mono text-xs uppercase tracking-[0.3em] text-brand-gold"
            >
              Sign In / Sign Up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
