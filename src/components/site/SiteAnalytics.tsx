"use client";

import { Analytics, type BeforeSend } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { BeforeSendMiddleware } from "@vercel/speed-insights";
import { sanitizeAnalyticsUrl } from "@/lib/analytics";

// Client wrapper so the root (server) layout can pass beforeSend filters.
const analyticsBeforeSend: BeforeSend = (event) => {
  const url = sanitizeAnalyticsUrl(event.url, event.type === "event" ? "event" : "view");
  return url ? { ...event, url } : null;
};

const speedBeforeSend: BeforeSendMiddleware = (event) => {
  const url = sanitizeAnalyticsUrl(event.url, "view");
  return url ? { ...event, url } : null;
};

export default function SiteAnalytics() {
  return (
    <>
      <Analytics beforeSend={analyticsBeforeSend} />
      <SpeedInsights beforeSend={speedBeforeSend} />
    </>
  );
}
