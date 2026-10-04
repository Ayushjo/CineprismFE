"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { trackNewsletterSubscribed } from "@/lib/analytics";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.thecineprism.com/api/v1";

type Sub = { status?: string };
type State =
  | { kind: "loading" }
  | { kind: "none" }
  | { kind: "ok"; status: string; subs: Sub[] }
  | { kind: "pending" };

export default function NewsletterStatus() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const hasSubId = !!params.get("razorpay_subscription_id");
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    if (!email) {
      setState({ kind: "none" });
      return;
    }
    let cancelled = false;
    let tries = 0;

    const check = async () => {
      tries += 1;
      try {
        const res = await fetch(`${API}/newsletter/status/${encodeURIComponent(email)}`);
        if (res.ok) {
          const d = await res.json();
          if (!cancelled) setState({ kind: "ok", status: d.status, subs: d.subscriptions || [] });
          return;
        }
      } catch {
        /* retry */
      }
      // Webhook may still be processing right after payment — poll a few times.
      if (!cancelled && tries < 4) setTimeout(check, 2500);
      else if (!cancelled) setState(hasSubId ? { kind: "pending" } : { kind: "none" });
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [email, hasSubId]);

  const active =
    state.kind === "ok" &&
    (state.status === "ACTIVE" || state.subs.some((s) => s.status === "ACTIVE"));

  useEffect(() => {
    if (active && hasSubId) trackNewsletterSubscribed();
  }, [active, hasSubId]);

  return (
    <div data-testid="newsletter-status" className="mx-auto max-w-2xl px-6 sm:px-10 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold mb-8">
        — The Dispatch
      </p>

      {state.kind === "loading" && (
        <p className="font-serif italic text-zinc-400 text-2xl">Checking your subscription…</p>
      )}

      {(active || state.kind === "pending") && (
        <>
          <h1 className="font-serif font-light text-white text-5xl sm:text-6xl leading-[0.95] mb-6">
            {active ? "Welcome to the Reel." : "Payment received."}
          </h1>
          <p className="font-mono text-sm leading-relaxed text-zinc-300">
            {active
              ? "Your subscription is active. Reel one lands this Friday."
              : "We're activating your subscription now — you'll get a confirmation by email shortly."}
          </p>
        </>
      )}

      {state.kind === "ok" && !active && (
        <>
          <h1 className="font-serif font-light text-white text-5xl sm:text-6xl mb-6">
            {state.status === "PENDING" ? "Almost there." : "Subscription status."}
          </h1>
          <p className="font-mono text-sm text-zinc-300 uppercase tracking-[0.2em]">
            Status — {state.status}
          </p>
        </>
      )}

      {state.kind === "none" && (
        <>
          <h1 className="font-serif font-light text-white text-5xl sm:text-6xl mb-6">
            No subscription found.
          </h1>
          <p className="font-mono text-sm text-zinc-400">
            Enter your details on the newsletter page to subscribe.
          </p>
        </>
      )}

      <div className="mt-12 flex items-center justify-center gap-6">
        <Link
          href="/newsletter"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-colors"
        >
          The Weekly →
        </Link>
        <Link
          href="/"
          className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white border-b border-white/20 hover:border-white pb-1 transition-colors"
        >
          Back home →
        </Link>
      </div>
    </div>
  );
}
