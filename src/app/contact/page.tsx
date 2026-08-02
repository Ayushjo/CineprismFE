import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import LegalLayout, { LegalSection } from "@/components/site/LegalLayout";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with The Cinéprism — tips, corrections, collaborations and hellos.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <LegalLayout
      label="Get in touch"
      title={<>Contact<span className="text-brand-gold">.</span></>}
      intro="Tips, corrections, collaborations — or a film we simply must watch."
    >
      <LegalSection heading="Email">
        <p>
          The fastest way to reach us:{" "}
          <a href="mailto:thecineprismwebsite@gmail.com" className="text-gold hover:text-white transition-colors">
            thecineprismwebsite@gmail.com
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="Elsewhere">
        <ul className="space-y-2">
          <li>
            X —{" "}
            <a href="https://x.com/thecineprism" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors">
              @thecineprism
            </a>
          </li>
          <li>
            Instagram —{" "}
            <a href="https://www.instagram.com/thecineprism" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white transition-colors">
              @thecineprism
            </a>
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="The Weekly">
        <p>
          Want our dispatches in your inbox every Friday? Subscribe to{" "}
          <a href="/newsletter" className="text-gold hover:text-white transition-colors">The Cinéprism Weekly</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
