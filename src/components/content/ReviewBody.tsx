/**
 * Renders a review's plain-text body (paragraphs split on blank lines)
 * with a cinematic drop-cap on the opening paragraph.
 */
export default function ReviewBody({ body }: { body: string[] }) {
  if (!body?.length) return null;
  return (
    <div className="review-body">
      {body.map((p, i) => (
        <p
          key={i}
          className={`font-serif text-lg sm:text-xl leading-[1.75] text-zinc-300 mb-8 ${
            i === 0
              ? "first-letter:font-serif first-letter:text-6xl sm:first-letter:text-7xl first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.9] first-letter:text-white"
              : ""
          }`}
        >
          {p}
        </p>
      ))}
    </div>
  );
}
