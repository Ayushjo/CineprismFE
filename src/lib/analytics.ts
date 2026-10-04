/*
 * Shared analytics helpers (Vercel Web Analytics + Speed Insights).
 *
 * Accuracy rules applied to every pageview / custom event / vital:
 *   1. Never count the admin dashboard or the OAuth callback hop.
 *   2. Never count devices that have signed in as ADMIN (the owner browsing).
 *   3. Strip query strings down to campaign params only — URLs here can carry
 *      a session JWT (/auth/callback?token=), emails (/newsletter?email=) and
 *      Razorpay IDs, none of which may leave the browser. It also stops one
 *      page from fragmenting into many rows by query string.
 */
import { track } from "@vercel/analytics";

/** localStorage flag marking this browser as the site owner's. */
export const ANALYTICS_IGNORE_KEY = "cineprism_analytics_ignore";

// Pageviews/vitals skip the OAuth hop too; custom events may fire there
// (e.g. "Sign In Completed"), so they're only excluded on /admin.
const EXCLUDED_PATH_PREFIXES = {
  view: ["/admin", "/auth/callback"],
  event: ["/admin"],
};

const ALLOWED_QUERY_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "ref",
]);

function isIgnoredDevice(): boolean {
  try {
    return localStorage.getItem(ANALYTICS_IGNORE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Returns the cleaned URL, or null if the event must be dropped. */
export function sanitizeAnalyticsUrl(raw: string, type: "view" | "event"): string | null {
  if (isIgnoredDevice()) return null;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  const path = url.pathname;
  if (EXCLUDED_PATH_PREFIXES[type].some((p) => path === p || path.startsWith(`${p}/`))) {
    return null;
  }

  for (const key of [...url.searchParams.keys()]) {
    if (!ALLOWED_QUERY_PARAMS.has(key)) url.searchParams.delete(key);
  }
  url.hash = "";
  return url.toString();
}

/** Excludes this browser from analytics from now on (called for admins). */
export function markAnalyticsIgnored() {
  try {
    localStorage.setItem(ANALYTICS_IGNORE_KEY, "1");
  } catch {
    /* storage unavailable — nothing to persist */
  }
}

/* ------------------------------ Custom events ------------------------------ */

type ContentKind = "review" | "article" | "other";

function contentKind(url: string): ContentKind {
  try {
    const path = new URL(url, window.location.origin).pathname;
    if (path.startsWith("/reviews/")) return "review";
    if (path.startsWith("/articles/")) return "article";
    // Short links don't reveal their target; fall back to the current page.
    if (path.startsWith("/s/")) return contentKind(window.location.href);
  } catch {
    /* fall through */
  }
  return "other";
}

/** A share action: channel is "native", "copy", or a share-menu key (x, whatsapp…). */
export function trackShare(channel: string, url: string) {
  track("Share", { channel, kind: contentKind(url) });
}

/** Where the user clicked "Continue with Google". */
export function trackSignInStart(source: "auth_page" | "gate") {
  track("Sign In Started", { source });
}

export function trackSignInComplete() {
  track("Sign In Completed");
}

export function trackNewsletterCheckoutStart(plan: string) {
  track("Newsletter Checkout Started", { plan });
}

// Razorpay navigates away right after payment, so checkout stashes the plan
// and the status page reports the subscription once it's confirmed ACTIVE.
// Consuming the key makes refreshes of the status page not double-count.
const PENDING_PLAN_KEY = "cineprism_pending_plan";

export function rememberPendingSubscription(plan: string) {
  try {
    sessionStorage.setItem(PENDING_PLAN_KEY, plan);
  } catch {
    /* noop */
  }
}

export function trackNewsletterSubscribed() {
  let plan: string | null = null;
  try {
    plan = sessionStorage.getItem(PENDING_PLAN_KEY);
    sessionStorage.removeItem(PENDING_PLAN_KEY);
  } catch {
    return;
  }
  if (plan) track("Newsletter Subscribed", { plan });
}
