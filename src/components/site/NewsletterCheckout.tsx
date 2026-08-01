"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global { interface Window { Razorpay?: any } }

function rupees(amount: string | number) {
  return Math.round((typeof amount === "string" ? parseFloat(amount) : amount) / 100);
}

export default function NewsletterCheckout() {
  const params = useSearchParams();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [email, setEmail] = useState(params.get("email") || "");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`${API}/newsletter/plans`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        const list: Plan[] = Array.isArray(d.plans) ? d.plans : [];
        // Monthly first, then yearly.
        list.sort((a, b) => (a.billingInterval === "MONTHLY" ? -1 : 1));
        setPlans(list);
        // Default to the yearly (best value) if present, else first.
        setSelected(list.find((p) => p.billingInterval === "YEARLY")?.id ?? list[0]?.id ?? null);
      })
      .catch(() => alive && setError("Couldn't load plans. Please try again."))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  // Yearly savings vs paying monthly for a year.
  const savings = useMemo(() => {
    const m = plans.find((p) => p.billingInterval === "MONTHLY");
    const y = plans.find((p) => p.billingInterval === "YEARLY");
    if (!m || !y) return 0;
    const annual = rupees(m.amount) * 12;
    const yr = rupees(y.amount);
    return annual > 0 ? Math.round(((annual - yr) / annual) * 100) : 0;
  }, [plans]);

  async function subscribe() {
    setError(null);
    const plan = plans.find((p) => p.id === selected);
    const addr = email.trim();
    if (!addr || !/.+@.+\..+/.test(addr)) return setError("Please enter a valid email.");
    if (!plan) return setError("Please choose a plan.");
    if (!window.Razorpay) return setError("Payment library still loading — try again in a moment.");

    setBusy(true);
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
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.open();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  }

  return (
    <div data-testid="newsletter-checkout" className="border border-white/15 bg-white/[0.02] p-8 sm:p-10">
      <Script src={RAZORPAY_SRC} strategy="afterInteractive" />

      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold mb-2">Join the Weekly</p>
      <h3 className="font-serif font-light text-white text-3xl mb-8">Reserve your seat.</h3>

      {/* Email + name */}
      <div className="space-y-5 mb-8">
        <div>
          <label htmlFor="nl-email" className="block font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-500 mb-2">
            Email
          </label>
          <input
            id="nl-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@somewhere.dark"
            data-testid="newsletter-email"
            className="w-full bg-transparent border-b border-white/25 focus:border-white transition-colors font-serif text-xl text-white placeholder:text-zinc-600 focus:outline-none py-2"
          />
        </div>
        <div>
          <label htmlFor="nl-name" className="block font-mono text-[9px] uppercase tracking-[0.28em] text-zinc-500 mb-2">
            Name (optional)
          </label>
          <input
            id="nl-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-transparent border-b border-white/25 focus:border-white transition-colors font-mono text-sm text-white placeholder:text-zinc-600 focus:outline-none py-2"
          />
        </div>
      </div>

      {/* Plan selection */}
      {loading ? (
        <p className="font-mono text-sm text-zinc-500">Loading plans…</p>
      ) : plans.length === 0 ? (
        <p className="font-serif italic text-zinc-500">No plans available right now.</p>
      ) : (
        <div className="space-y-3 mb-8">
          {plans.map((plan) => {
            const active = selected === plan.id;
            const yearly = plan.billingInterval === "YEARLY";
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelected(plan.id)}
                data-testid={`plan-${plan.id}`}
                className={`w-full flex items-center justify-between gap-4 border px-5 py-4 text-left transition-colors ${
                  active ? "border-brand-gold bg-brand-gold/10" : "border-white/15 hover:border-white/40"
                }`}
              >
                <span className="flex items-center gap-4">
                  <span
                    className={`grid place-items-center h-5 w-5 rounded-full border ${
                      active ? "border-brand-gold text-brand-gold" : "border-white/30 text-transparent"
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-300">
                      {yearly ? "Annual" : "Monthly"}
                    </span>
                    {yearly && savings > 0 ? (
                      <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-gold mt-0.5">
                        Save {savings}%
                      </span>
                    ) : null}
                  </span>
                </span>
                <span className="text-right">
                  <span className="font-serif text-3xl text-white">₹{rupees(plan.amount)}</span>
                  <span className="font-mono text-[10px] text-zinc-500"> / {yearly ? "yr" : "mo"}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      {error && (
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-red-400 border border-red-500/30 bg-red-500/5 px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={subscribe}
        disabled={busy || loading || plans.length === 0}
        data-testid="newsletter-subscribe"
        className="w-full inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white bg-white text-black px-6 py-4 font-mono text-[11px] uppercase tracking-[0.28em] transition-colors hover:bg-transparent hover:text-white disabled:opacity-50"
      >
        {busy ? "Opening…" : "Reserve a seat →"}
      </button>

      <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.24em] text-zinc-600 text-center">
        Secured by Razorpay · Cancel anytime
      </p>
    </div>
  );
}
