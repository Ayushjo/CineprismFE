import type { Metadata } from "next";
import { Suspense } from "react";
import AuthCallback from "@/components/site/AuthCallback";

export const metadata: Metadata = {
  title: "Signing in… — The Cinéprism",
  robots: { index: false, follow: false },
};

export default function AuthCallbackPage() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center py-40">
      <Suspense fallback={<p className="font-mono text-sm text-zinc-500">Loading…</p>}>
        <AuthCallback />
      </Suspense>
    </section>
  );
}
