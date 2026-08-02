"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

const inputCls =
  "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500";
const labelCls = "block text-xs uppercase tracking-wider text-slate-400 mb-2";

export default function CreateQuotePage() {
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!quote.trim() || !author.trim()) return toast.error("Quote and attribution are required.");
    setBusy(true);
    const t = toast.loading("Adding quote…");
    try {
      await adminApi.post("/admin/add-quotes", { quote: quote.trim(), author: author.trim() });
      toast.success("Quote added.", { id: t });
      setQuote(""); setAuthor("");
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed.", { id: t });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Create Quote</h1>
        <p className="text-slate-400 text-sm mt-1">Adds to the rotating film-quote band on the home page.</p>
      </header>
      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className={labelCls}>Quote</label>
          <textarea className={`${inputCls} min-h-[90px] font-serif italic`} value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="I'm gonna make him an offer he can't refuse." />
        </div>
        <div>
          <label className={labelCls}>Attribution</label>
          <input className={inputCls} value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="The Godfather (1972)" />
        </div>
        <button type="submit" disabled={busy} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-md text-sm transition-colors disabled:opacity-50">
          {busy ? "Adding…" : "Add Quote"}
        </button>
      </form>
    </div>
  );
}
