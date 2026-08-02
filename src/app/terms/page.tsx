import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import LegalLayout, { LegalSection } from "@/components/site/LegalLayout";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms governing your use of The Cinéprism.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalLayout label="The fine print" title={<>Terms of Service<span className="text-brand-gold">.</span></>} updated="August 2, 2026">
      <LegalSection heading="Agreement to terms">
        <p>
          By accessing The Cinéprism (the &ldquo;Site&rdquo;) you agree to these Terms. If you
          do not agree, please do not use the Site.
        </p>
      </LegalSection>

      <LegalSection heading="Accounts">
        <p>
          Some features require signing in with Google. You are responsible for activity under
          your account and for keeping your Google credentials secure. We may suspend accounts
          that abuse the Site or violate these Terms.
        </p>
      </LegalSection>

      <LegalSection heading="Content & intellectual property">
        <p>
          All editorial content — reviews, essays, ratings and curation — is the property of
          The Cinéprism unless otherwise credited. Film stills, posters and third-party imagery
          remain the property of their respective owners and are used for commentary and
          criticism. You may share links freely; please do not republish our writing without
          permission.
        </p>
      </LegalSection>

      <LegalSection heading="Subscriptions & payments">
        <p>
          Paid newsletter subscriptions are billed through Razorpay. Subscriptions renew until
          cancelled; you may cancel at any time, and access continues until the end of the paid
          period. Payments are processed by Razorpay under their terms — we never see or store
          your full card details.
        </p>
      </LegalSection>

      <LegalSection heading="Disclaimer">
        <p>
          The Site is provided &ldquo;as is.&rdquo; Opinions are our own and are not
          professional advice. Third-party data (e.g. trending charts and film metadata) may be
          inaccurate or out of date. We are not liable for any loss arising from use of the Site.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          We may update these Terms from time to time. Continued use of the Site after changes
          take effect constitutes acceptance of the revised Terms.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions? Email{" "}
          <a href="mailto:thecineprismwebsite@gmail.com" className="text-gold hover:text-white transition-colors">
            thecineprismwebsite@gmail.com
          </a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
