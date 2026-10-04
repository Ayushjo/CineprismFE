"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { trackSignInStart } from "@/lib/analytics";

/**
 * SEO-safe soft gate. The children (server-rendered) ALWAYS stay in the DOM so
 * crawlers index the full content; non-authenticated humans see a clipped
 * teaser + a sign-in wall. Pair with paywall JSON-LD (isAccessibleForFree:false)
 * on the page so Google treats this as sanctioned gated content, not cloaking.
 *
 * The gated region is marked with the class `paywalled-content` for the
 * structured-data cssSelector.
 */
export default function AuthGate({
  children,
  label = "the full piece",
}: {
  children: React.ReactNode;
  label?: string;
}) {
  const { user, loading, loginWithGoogle } = useAuth();
  const pathname = usePathname();

  // Authenticated (or still checking) → full content, ungated.
  if (user || loading) {
    return <div className="paywalled-content">{children}</div>;
  }

  // Not authenticated → keep content in the DOM (SEO) but clip + wall it.
  return (
    <div data-testid="auth-gate" className="relative">
      <div
        className="paywalled-content relative max-h-[48vh] overflow-hidden"
        aria-hidden="true"
      >
        {children}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-ink via-ink/95 to-transparent" />
      </div>

      <div className="relative z-10 -mt-28 flex flex-col items-center text-center px-6 pb-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold mb-5">
          — Members&rsquo; Reel
        </p>
        <h3 className="font-serif font-light text-white text-3xl sm:text-4xl mb-4">
          Sign in to read {label}.
        </h3>
        <p className="font-mono text-sm leading-relaxed text-zinc-400 max-w-md mb-8">
          The Cinéprism is free — one tap with Google, no passwords, and you keep
          your seat in the dark.
        </p>
        <button
          type="button"
          onClick={() => {
            trackSignInStart("gate");
            loginWithGoogle(pathname);
          }}
          data-testid="gate-signin"
          className="inline-flex items-center gap-3 border border-white/25 bg-white text-black hover:bg-transparent hover:text-white hover:border-white px-8 py-4 font-mono text-[11px] uppercase tracking-[0.28em] transition-colors"
        >
          Continue with Google →
        </button>
      </div>
    </div>
  );
}
