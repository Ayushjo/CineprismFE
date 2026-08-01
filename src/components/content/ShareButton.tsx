"use client";

import { useEffect, useRef, useState } from "react";
import { Share2, Link2, Check, X } from "lucide-react";

type ShareButtonProps = {
  title: string;
  /** Absolute URL to share. Falls back to current location. */
  url?: string;
  text?: string;
  className?: string;
  /** "full" = labelled button (detail hero), "icon" = compact (cards). */
  variant?: "full" | "icon";
};

type Channel = {
  key: string;
  label: string;
  href: (u: string, t: string) => string;
};

const channels: Channel[] = [
  {
    key: "x",
    label: "X / Twitter",
    href: (u, t) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}&via=TheCineprism`,
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: (u, t) => `https://wa.me/?text=${encodeURIComponent(`${t} ${u}`)}`,
  },
  {
    key: "facebook",
    label: "Facebook",
    href: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  },
  {
    key: "reddit",
    label: "Reddit",
    href: (u, t) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(u)}&title=${encodeURIComponent(t)}`,
  },
  {
    key: "email",
    label: "Email",
    href: (u, t) =>
      `mailto:?subject=${encodeURIComponent(t)}&body=${encodeURIComponent(`Thought you'd appreciate this — ${u}`)}`,
  },
];

export default function ShareButton({
  title,
  url,
  text,
  className = "",
  variant = "full",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState(url ?? "");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!url && typeof window !== "undefined") setResolvedUrl(window.location.href);
  }, [url]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const shareText = text || title;

  const handleClick = async () => {
    const shareUrl = resolvedUrl || (typeof window !== "undefined" ? window.location.href : "");
    // Prefer the OS-native share sheet (mobile) — best UX.
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
        return;
      } catch {
        /* user dismissed — fall through to menu */
      }
    }
    setOpen((v) => !v);
  };

  const copyLink = async () => {
    const shareUrl = resolvedUrl || window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* noop */
    }
  };

  const trigger =
    variant === "full" ? (
      <button
        type="button"
        data-testid="share-btn"
        onClick={handleClick}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-3 border border-white/20 px-5 py-3 transition-colors duration-300 hover:border-white hover:bg-white hover:text-black text-zinc-300 font-mono text-[10px] uppercase tracking-[0.28em]"
      >
        <Share2 className="h-4 w-4" />
        <span>Share — Spread the word</span>
      </button>
    ) : (
      <button
        type="button"
        data-testid="share-btn-icon"
        onClick={handleClick}
        aria-label={`Share ${title}`}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center justify-center h-9 w-9 border border-white/20 text-zinc-300 hover:border-white hover:bg-white hover:text-black transition-colors"
      >
        <Share2 className="h-4 w-4" />
      </button>
    );

  return (
    <div ref={ref} className={`relative ${className}`}>
      {trigger}

      {open && (
        <div
          role="menu"
          data-testid="share-menu"
          className="absolute right-0 z-50 mt-3 w-64 border border-white/15 bg-black/95 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">
              Share this
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close share menu"
              className="text-zinc-500 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Copy link row */}
          <button
            type="button"
            onClick={copyLink}
            className="flex w-full items-center gap-3 px-4 py-3 text-left font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-300 hover:bg-white hover:text-black transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-brand-gold" /> : <Link2 className="h-4 w-4" />}
            <span>{copied ? "Link copied" : "Copy link"}</span>
          </button>

          <div className="h-px bg-white/10" />

          {channels.map((c) => (
            <a
              key={c.key}
              href={c.href(resolvedUrl || (typeof window !== "undefined" ? window.location.href : ""), shareText)}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-300 hover:bg-white hover:text-black transition-colors"
            >
              <span aria-hidden className="h-1.5 w-1.5 bg-current opacity-40" />
              <span>{c.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
