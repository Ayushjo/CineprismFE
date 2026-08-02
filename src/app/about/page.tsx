import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import LegalLayout, { LegalSection } from "@/components/site/LegalLayout";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "The Cinéprism is a journal of serious film — reviews, essays and curated picks for people who take cinema seriously.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <LegalLayout
      label="Who we are"
      title={<>About the <span className="italic text-brand-gold">Cinéprism</span>.</>}
      intro="Not criticism as verdict — criticism as devotion."
    >
      <LegalSection heading="A journal of serious film">
        <p>
          The Cinéprism is a small, obsessive publication about cinema — reviews, long-form
          essays, curated shortlists and the occasional love letter to a film that deserved
          one. We write for people who sit through the credits.
        </p>
        <p>
          We cover world cinema, the American canon, Bollywood and everything the mainstream
          overlooks — one honest voice, no algorithm deciding what you should think.
        </p>
      </LegalSection>

      <LegalSection heading="What you'll find here">
        <ul className="list-disc pl-5 space-y-2 marker:text-gold">
          <li>Close-read reviews with our own rating breakdown</li>
          <li>Long-form essays and dispatches</li>
          <li>Curated Top Picks and genre collections</li>
          <li>The Pulse — what the world is watching, read through our lens</li>
          <li>The Weekly — our newsletter, delivered every Friday</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Say hello">
        <p>
          Tips, corrections, or a film we simply must watch? Write to us at{" "}
          <a href="mailto:thecineprismwebsite@gmail.com" className="text-gold hover:text-white transition-colors">
            thecineprismwebsite@gmail.com
          </a>{" "}
          — or find us on{" "}
          <a href="https://x.com/thecineprism" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors">X</a>{" "}
          and{" "}
          <a href="https://www.instagram.com/thecineprism" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors">Instagram</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
