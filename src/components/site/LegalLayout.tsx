export default function LegalLayout({
  label,
  title,
  intro,
  updated,
  children,
}: {
  label: string;
  title: React.ReactNode;
  intro?: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <section className="relative pt-40 sm:pt-48 pb-14 sm:pb-20 border-b border-white/10">
        <div className="mx-auto max-w-3xl px-6 sm:px-10">
          <div className="flex items-center gap-4 mb-8">
            <span className="h-px w-12 bg-brand-gold" />
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-zinc-500">{label}</p>
          </div>
          <h1 className="font-serif font-light text-white text-5xl sm:text-6xl lg:text-7xl leading-[0.92] tracking-[-0.02em]">
            {title}
          </h1>
          {intro ? (
            <p className="mt-8 font-serif italic text-zinc-300 text-xl sm:text-2xl leading-relaxed">
              {intro}
            </p>
          ) : null}
          {updated ? (
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-600">
              Last updated — {updated}
            </p>
          ) : null}
        </div>
      </section>

      <section className="relative py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 legal-prose">{children}</div>
      </section>
    </div>
  );
}

/** A titled prose section for legal/info pages. */
export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="font-serif font-light text-white text-2xl sm:text-3xl mb-5">{heading}</h2>
      <div className="space-y-4 font-mono text-sm leading-relaxed text-zinc-400">{children}</div>
    </div>
  );
}
