"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const socials = [
  { label: "X", href: "https://x.com/thecineprism", Icon: XIcon },
  { label: "Instagram", href: "https://www.instagram.com/thecineprism", Icon: InstagramIcon },
];

const links = [
  { label: "Reviews", to: "/reviews" },
  { label: "Top Picks", to: "/top-picks" },
  { label: "Genres", to: "/genres" },
  { label: "Trending", to: "/trending" },
  { label: "Articles", to: "/articles" },
  { label: "Weekly", to: "/newsletter" },
];

export default function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
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

  const signInHref =
    pathname && !pathname.startsWith("/auth")
      ? `/auth?returnTo=${encodeURIComponent(pathname)}`
      : "/auth";

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
            alt="The Cinéprism"
            width={36}
            height={36}
            priority
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover ring-1 ring-white/20 shrink-0"
          />
          <span className="font-serif text-xl sm:text-2xl tracking-[0.02em] text-white leading-none">
            The<span className="italic font-light"> Cinéprism</span>
          </span>
        </Link>

        {/* Center links */}
        <nav aria-label="Primary" className="hidden lg:flex items-center gap-6 xl:gap-9">
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
        <div className="flex items-center gap-4">
          {/* Socials */}
          <div className="hidden xl:flex items-center gap-4">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                data-testid={`nav-social-${label.toLowerCase()}`}
                className="text-zinc-400 hover:text-white transition-colors duration-300"
              >
                <Icon className="h-[15px] w-[15px]" />
              </a>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden xl:inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-300">
                {user.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt=""
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
                  />
                ) : null}
                <span className="max-w-[120px] truncate">{user.username}</span>
              </span>
              <button
                type="button"
                onClick={logout}
                data-testid="nav-logout-btn"
                className="inline-flex items-center gap-2 border border-white/20 hover:border-white bg-transparent px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href={signInHref}
              data-testid="nav-signin-btn"
              className="inline-flex items-center gap-2 border border-white/20 hover:border-white bg-transparent px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-white transition-colors duration-300 hover:bg-white hover:text-black"
            >
              <span>Sign In</span>
              <span aria-hidden="true">→</span>
            </Link>
          )}
          <button
            type="button"
            aria-label="Toggle menu"
            data-testid="nav-menu-toggle"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden flex flex-col gap-[5px] items-end w-8 h-8 justify-center"
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
          className="lg:hidden border-t border-white/10 bg-black/90 backdrop-blur-xl"
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
              href={signInHref}
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
