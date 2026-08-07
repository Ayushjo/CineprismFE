import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";
import { slugify } from "@/lib/utils";

/**
 * Short-link resolver: GET /s/<code>
 *
 * Asks the backend what a short code points at, then 301-redirects to the
 * canonical page. A 301 (permanent) is deliberate — it passes link equity and
 * lets crawlers / social scrapers (WhatsApp, X, Slack) follow through to the
 * real page and read its OG tags, so previews still render the main image.
 *
 * Unknown / expired codes fall back to the homepage (302, not cached).
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const origin = new URL(req.url).origin;

  try {
    const res = await fetch(`${API_BASE}/s/${encodeURIComponent(code)}`, {
      // Always hit the backend; codes can be created at any time.
      cache: "no-store",
    });

    if (res.ok) {
      const data = (await res.json()) as
        | { type: "review"; id: string; title: string }
        | { type: "article"; slug: string };

      if (data.type === "review" && data.id && data.title) {
        return NextResponse.redirect(
          `${origin}/reviews/${slugify(data.title)}-${data.id}`,
          301
        );
      }
      if (data.type === "article" && data.slug) {
        return NextResponse.redirect(`${origin}/articles/${data.slug}`, 301);
      }
    }
  } catch {
    /* fall through to homepage */
  }

  return NextResponse.redirect(`${origin}/`, 302);
}
