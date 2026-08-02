import type { Metadata } from "next";
import { Suspense } from "react";
import AuthSignIn from "@/components/site/AuthSignIn";

export const metadata: Metadata = {
  title: "Sign In — The Cinéprism",
  robots: { index: false, follow: false },
};

export default function AuthPage() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-32">
      {/* Faint wordmark backdrop */}
      <h2
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-x-0 bottom-0 text-center font-serif font-light text-white/[0.03] leading-[0.85] tracking-tighter uppercase whitespace-nowrap text-[26vw]"
      >
        Enter
      </h2>
      <Suspense fallback={<p className="font-mono text-sm text-zinc-500">Loading…</p>}>
        <AuthSignIn />
      </Suspense>
    </section>
  );
}
