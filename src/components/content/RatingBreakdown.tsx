import type { RatingCategory } from "@/types/content";

/**
 * Renders backend `ratingCategories` ([{category, score 0–100}]) as an
 * editorial breakdown with thin bars, plus a derived aggregate.
 */
export default function RatingBreakdown({
  rating,
  className = "",
}: {
  rating: RatingCategory[];
  className?: string;
}) {
  if (!rating?.length) return null;
  const avg = Math.round(rating.reduce((a, c) => a + c.score, 0) / rating.length);

  return (
    <div className={className} data-testid="rating-breakdown">
      <div className="flex items-end justify-between border-t border-white/10 pt-6 mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-gold">
          — The Verdict
        </p>
        <div className="text-right">
          <span className="font-serif text-5xl leading-none text-white">{avg}</span>
          <span className="font-mono text-xs text-zinc-500"> / 100</span>
        </div>
      </div>

      <dl className="space-y-5">
        {rating.map((r) => (
          <div key={r.category} className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <div className="flex items-baseline justify-between mb-2">
                <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-300">
                  {r.category}
                </dt>
                <dd className="font-mono text-[11px] text-zinc-500">{r.score}</dd>
              </div>
              <div className="h-px w-full bg-white/10" aria-hidden>
                <div
                  className="h-px bg-brand-gold"
                  style={{ width: `${Math.min(100, Math.max(0, r.score))}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
