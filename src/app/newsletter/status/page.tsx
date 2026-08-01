import type { Metadata } from "next";
import { Suspense } from "react";
import NewsletterStatus from "@/components/site/NewsletterStatus";

export const metadata: Metadata = {
  title: "Subscription Status — The Cineprism",
  robots: { index: false, follow: false },
};

export default function NewsletterStatusPage() {
  return (
    <section className="relative min-h-[70vh] flex items-center py-40">
      <Suspense fallback={<p className="mx-auto font-mono text-sm text-zinc-500">Loading…</p>}>
        <NewsletterStatus />
      </Suspense>
    </section>
  );
}
