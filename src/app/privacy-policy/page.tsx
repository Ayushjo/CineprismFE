import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import LegalLayout, { LegalSection } from "@/components/site/LegalLayout";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How The Cinéprism collects, uses and protects your data.",
  path: "/privacy-policy",
});

export default function PrivacyPage() {
  return (
    <LegalLayout label="Your data" title={<>Privacy Policy<span className="text-brand-gold">.</span></>} updated="August 2, 2026">
      <LegalSection heading="What we collect">
        <p>When you sign in with Google, we receive your name, email address and profile photo. That&rsquo;s it — we never receive your Google password.</p>
        <p>If you subscribe to the newsletter, we store your email and subscription status. Payments are handled by Razorpay; we do not see or store your card details.</p>
        <p>Like most sites, we collect basic, non-identifying analytics (pages visited, device type) to understand what readers enjoy.</p>
      </LegalSection>

      <LegalSection heading="How we use it">
        <ul className="list-disc pl-5 space-y-2 marker:text-gold">
          <li>To sign you in and remember you</li>
          <li>To deliver the newsletter you subscribed to</li>
          <li>To process and manage your subscription via Razorpay</li>
          <li>To improve the Site and our editorial coverage</li>
        </ul>
        <p>We do not sell your personal data. Ever.</p>
      </LegalSection>

      <LegalSection heading="Third parties">
        <p>
          We rely on a few trusted services: Google (sign-in), Razorpay (payments), and cloud
          providers for hosting and image delivery. Each processes data under its own privacy
          policy. Film metadata and trending data are sourced from third-party APIs.
        </p>
      </LegalSection>

      <LegalSection heading="Your choices">
        <p>
          You can unsubscribe from the newsletter at any time via the link in every email, or by
          contacting us. To delete your account or request a copy of your data, email us and
          we&rsquo;ll take care of it.
        </p>
      </LegalSection>

      <LegalSection heading="Children's privacy">
        <p>The Site is not directed at children under 13, and we do not knowingly collect their data.</p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Privacy questions? Email{" "}
          <a href="mailto:thecineprismwebsite@gmail.com" className="text-gold hover:text-white transition-colors">
            thecineprismwebsite@gmail.com
          </a>.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
