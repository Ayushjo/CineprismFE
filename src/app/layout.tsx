import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Instrument_Serif, Inter } from "next/font/google";
import "./globals.css";
import GrainOverlay from "@/components/site/GrainOverlay";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Chrome from "@/components/site/Chrome";
import SiteAnalytics from "@/components/site/SiteAnalytics";
import { AuthProvider } from "@/providers/AuthProvider";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, TWITTER_HANDLE } from "@/lib/seo";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — A Journal of Serious Film`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — A Journal of Serious Film`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${instrument.variable} ${plexMono.variable} ${inter.variable}`}
    >
      <body className="bg-ink text-white antialiased selection:bg-brand-gold selection:text-black">
        <AuthProvider>
          <Chrome grain={<GrainOverlay />} nav={<Nav />} footer={<Footer />}>
            {children}
          </Chrome>
        </AuthProvider>
        <SiteAnalytics />
      </body>
    </html>
  );
}
