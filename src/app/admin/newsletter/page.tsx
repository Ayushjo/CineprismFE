"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

type Stats = { totalSubscribers?: number; activeSubscribers?: number; totalCampaigns?: number };
type Subscriber = { id: string; email: string; status?: string };
type Campaign = { id: string; subject: string; status?: string; createdAt?: string };
type Plan = { id: string; name: string; billingInterval: string };

const inputCls =
  "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500";
const labelCls = "block text-xs uppercase tracking-wider text-slate-400 mb-2";

export default function NewsletterAdminPage() {
  const [stats, setStats] = useState<Stats>({});
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [form, setForm] = useState({ planId: "", subject: "", previewText: "", content: "" });
  const [busy, setBusy] = useState(false);

  const loadCampaigns = () => adminApi.get("/admin/newsletter/campaigns").then((r) => setCampaigns(r.data.campaigns || [])).catch(() => {});

  useEffect(() => {
    adminApi.get("/admin/newsletter/stats").then((r) => setStats(r.data || {})).catch(() => {});
    adminApi.get("/admin/newsletter/subscribers").then((r) => setSubs(r.data.subscribers || [])).catch(() => {});
    adminApi.get("/newsletter/plans").then((r) => {
      const p = r.data.plans || [];
      setPlans(p);
      if (p[0]) setForm((f) => ({ ...f, planId: p[0].id }));
    }).catch(() => {});
    loadCampaigns();
  }, []);

  async function createCampaign(e: React.FormEvent) {
    e.preventDefault();
    if (!form.subject.trim() || !form.content.trim() || !form.planId) return toast.error("Plan, subject and content are required.");
    setBusy(true);
    const t = toast.loading("Creating campaign…");
    try {
      await adminApi.post("/admin/newsletter/campaigns", form);
      toast.success("Campaign created (draft).", { id: t });
      setForm((f) => ({ ...f, subject: "", previewText: "", content: "" }));
      loadCampaigns();
    } catch (err) {
      toast.error((err as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed.", { id: t });
    } finally {
      setBusy(false);
    }
  }

  async function send(id: string) {
    if (!confirm("Send this campaign to all active subscribers?")) return;
    const t = toast.loading("Sending…");
    try {
      await adminApi.post(`/admin/newsletter/campaigns/${id}/send`, {});
      toast.success("Campaign sending.", { id: t });
      loadCampaigns();
    } catch {
      toast.error("Failed to send.", { id: t });
    }
  }

  const statCards = [
    { label: "Subscribers", value: stats.totalSubscribers ?? subs.length },
    { label: "Active", value: stats.activeSubscribers ?? "—" },
    { label: "Campaigns", value: stats.totalCampaigns ?? campaigns.length },
  ];

  return (
    <div className="p-8 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Newsletter</h1>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {statCards.map((s) => (
          <div key={s.label} className="border border-slate-800 rounded-lg p-5 bg-slate-900/50">
            <p className="text-slate-500 text-xs uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-semibold text-white mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Create campaign */}
        <div>
          <h2 className="text-white font-medium mb-4">New campaign</h2>
          <form onSubmit={createCampaign} className="space-y-4">
            <div>
              <label className={labelCls}>Plan</label>
              <select className={inputCls} value={form.planId} onChange={(e) => setForm({ ...form, planId: e.target.value })}>
                {plans.map((p) => (<option key={p.id} value={p.id}>{p.name} · {p.billingInterval}</option>))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Subject</label>
              <input className={inputCls} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Preview text</label>
              <input className={inputCls} value={form.previewText} onChange={(e) => setForm({ ...form, previewText: e.target.value })} />
            </div>
            <div>
              <label className={labelCls}>Content (HTML)</label>
              <textarea className={`${inputCls} min-h-[160px] font-mono`} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
            </div>
            <button type="submit" disabled={busy} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2.5 rounded-md text-sm transition-colors disabled:opacity-50">
              {busy ? "Creating…" : "Create draft"}
            </button>
          </form>
        </div>

        {/* Campaigns list */}
        <div>
          <h2 className="text-white font-medium mb-4">Campaigns</h2>
          <div className="border border-slate-800 rounded-lg divide-y divide-slate-800">
            {campaigns.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-4 py-3 gap-3">
                <div className="min-w-0">
                  <p className="text-slate-200 text-sm truncate">{c.subject}</p>
                  <p className="text-slate-500 text-xs">{c.status || "DRAFT"}</p>
                </div>
                {c.status !== "SENT" && (
                  <button onClick={() => send(c.id)} className="text-emerald-400 hover:text-emerald-300 text-xs uppercase tracking-wider shrink-0">Send</button>
                )}
              </div>
            ))}
            {campaigns.length === 0 && <p className="px-4 py-6 text-slate-600 text-sm text-center">No campaigns.</p>}
          </div>

          <h2 className="text-white font-medium mt-8 mb-4">Recent subscribers</h2>
          <div className="border border-slate-800 rounded-lg divide-y divide-slate-800 max-h-64 overflow-y-auto">
            {subs.slice(0, 30).map((s) => (
              <div key={s.id} className="flex items-center justify-between px-4 py-2.5">
                <span className="text-slate-300 text-sm truncate">{s.email}</span>
                <span className="text-slate-500 text-xs shrink-0 ml-3">{s.status}</span>
              </div>
            ))}
            {subs.length === 0 && <p className="px-4 py-6 text-slate-600 text-sm text-center">No subscribers.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
