"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.thecineprism.com/api/v1";
const RAZORPAY_SRC = "https://checkout.razorpay.com/v1/checkout.js";

type Plan = {
  id: string;
  name: string;
  description?: string | null;
  type: "BOLLYWOOD" | "HOLLYWOOD";
  billingInterval: "MONTHLY" | "YEARLY";
  amount: string | number;
  currency: string;
};

type Interval = "MONTHLY" | "YEARLY";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { Razorpay?: any } }

function formatPrice(amount: string | number, currency: string) {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  const symbol = currency?.toLowerCase() === "inr" ? "₹" : "";
  return `${symbol}${Math.round(n)}`;
}

export default function NewsletterCheckout() {
  const params = useSearchParams();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState<Interval>("MONTHLY");
  const [email, setEmail] = useState(params.get("email") || "");
  const [name, setName] = useState("");
  const [busyPlan, setBusyPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`${API}/newsletter/plans`)
      .then((r) => r.json())
      .then((d) => {
        if (alive) setPlans(Array.isArray(d.plans) ? d.plans : []);
      })
      .catch(() => alive && setError("Couldn't load plans. Please try again."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const shown = useMemo(
    () => plans.filter((p) => p.billingInterval === interval),
    [plans, interval]
  );
  const hasYearly = plans.some((p) => p.billingInterval === "YEARLY");

  async function subscribe(plan: Plan) {
    setError(null);
    const addr = email.trim();
    if (!addr || !/.+@.+\..+/.test(addr)) {
      setError("Please enter a valid email above first.");
      return;
    }
    if (!window.Razorpay) {
      setError("Payment library still loading — try again in a moment.");
      return;
    }
    setBusyPlan(plan.id);
    try {
      const res = await fetch(`${API}/newsletter/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addr, name: name.trim() || addr, planId: plan.id, country: "IN" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed");

      const rzp = new window.Razorpay({
        key: data.razorpayKeyId,
        subscription_id: data.subscriptionId,
        name: "The Cinéprism Weekly",
        description: `${plan.name} · ${plan.billingInterval.toLowerCase()}`,
        theme: { color: "#D4AF37" },
        prefill: { email: addr, name: name.trim() || undefined },
        handler(response: { razorpay_subscription_id?: string }) {
          window.location.href = `/newsletter/status?razorpay_subscription_id=${response.razorpay_subscription_id || ""}&email=${encodeURIComponent(addr)}`;
        },
        modal: { ondismiss: () => setBusyPlan(null) },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusyPlan(null);
    }
  }

  return (
    <div data-testid="newsletter-checkout" className="mx-auto max-w-[1100px] px-6 sm:px-10">
      <Script src={RAZORPAY_SRC} strategy="afterInteractive" />

      {/* Email */}
      <div className="max-w-xl mb-12">
        <label htmlFor="nl-email" className="block font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-4">
          — Your correspondence
        </label>
        <input
          id="nl-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@somewhere.dark"
          data-testid="newsletter-email"
          className="w-full bg-transparent border-b border-white/30 focus:border-white transition-colors font-serif text-2xl sm:text-3xl text-white placeholder:text-zinc-600 focus:outline-none py-2"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (optional)"
          className="mt-4 w-full bg-transparent border-b border-white/10 focus:border-white/40 transition-colors font-mono text-sm text-white placeholder:text-zinc-600 focus:outline-none py-2"
        />
      </div>

      {/* Interval toggle */}
      {hasYearly && (
        <div className="flex items-center gap-2 mb-10">
          {(["MONTHLY", "YEARLY"] as Interval[]).map((iv) => (
            <button
              key={iv}
              type="button"
              onClick={() => setInterval(iv)}
              className={`font-mono text-[10px] uppercase tracking-[0.24em] px-4 py-2 border transition-colors ${
                interval === iv
                  ? "border-brand-gold text-white bg-brand-gold/10"
                  : "border-white/15 text-zinc-400 hover:border-white/40 hover:text-white"
              }`}
            >
              {iv === "MONTHLY" ? "Monthly" : "Yearly"}
              {iv === "YEARLY" ? <span className="ml-2 text-gold">· save</span> : null}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.2em] text-red-400 border border-red-500/30 bg-red-500/5 px-4 py-3">
          {error}
        </p>
      )}

      {/* Plans */}
      {loading ? (
        <p className="font-mono text-sm text-zinc-500">Loading plans…</p>
      ) : shown.length === 0 ? (
        <p className="font-serif italic text-zinc-500 text-lg">No plans available right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {shown.map((plan) => (
            <div
              key={plan.id}
              data-testid={`plan-${plan.id}`}
              className="flex flex-col border border-white/10 hover:border-white/25 transition-colors p-8"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-4">
                {plan.type === "BOLLYWOOD" ? "Bollywood Edition" : "Hollywood Edition"}
              </p>
              <h3 className="font-serif font-light text-white text-3xl sm:text-4xl mb-4">
                {plan.name}
              </h3>
              {plan.description ? (
                <p className="font-mono text-sm leading-relaxed text-zinc-400 mb-8">
                  {plan.description}
                </p>
              ) : null}
              <div className="mt-auto">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="font-serif text-5xl text-white">
                    {formatPrice(plan.amount, plan.currency)}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                    / {plan.billingInterval === "MONTHLY" ? "month" : "year"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => subscribe(plan)}
                  disabled={busyPlan === plan.id}
                  data-testid={`subscribe-${plan.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white bg-transparent hover:bg-white hover:text-black px-6 py-4 font-mono text-[11px] uppercase tracking-[0.28em] text-white transition-colors disabled:opacity-50"
                >
                  {busyPlan === plan.id ? "Opening…" : "Reserve a seat →"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
        Secured by Razorpay · Cancel anytime · No spam, unsubscribe at any dissolve.
      </p>
    </div>
  );
}
