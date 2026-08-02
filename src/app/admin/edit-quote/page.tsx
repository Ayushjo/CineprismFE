"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

type Quote = { id: string; quote: string; author: string; rank?: number };

const inputCls =
  "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500";
const labelCls = "block text-xs uppercase tracking-wider text-slate-400 mb-2";

export default function EditQuotePage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [sel, setSel] = useState<Quote | null>(null);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () =>
    adminApi.get("/admin/fetch-quotes").then((r) => setQuotes(r.data.quotes || [])).catch(() => {});
  useEffect(() => { load(); }, []);

  const pick = (q: Quote) => { setSel(q); setQuote(q.quote); setAuthor(q.author); };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sel) return;
    setBusy(true);
    const t = toast.loading("Saving…");
    try {
      await adminApi.post("/admin/edit-quote", { id: sel.id, quote: quote.trim(), author: author.trim() });
      toast.success("Quote updated.", { id: t });
      load();
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed.", { id: t });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Edit Quote</h1>
      </header>

      <div className="mb-8 max-h-64 overflow-y-auto border border-slate-800 rounded-md divide-y divide-slate-800">
        {quotes.map((q) => (
          <button key={q.id} type="button" onClick={() => pick(q)} className={`w-full text-left px-4 py-3 hover:bg-slate-800/50 ${sel?.id === q.id ? "bg-emerald-500/10" : ""}`}>
            <p className="text-slate-200 font-serif italic text-sm">&ldquo;{q.quote}&rdquo;</p>
            <p className="text-slate-500 text-xs mt-1">— {q.author}</p>
          </button>
        ))}
        {quotes.length === 0 && <p className="px-4 py-4 text-slate-600 text-sm">No quotes yet.</p>}
      </div>

      {sel && (
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className={labelCls}>Quote</label>
            <textarea className={`${inputCls} min-h-[90px] font-serif italic`} value={quote} onChange={(e) => setQuote(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Attribution</label>
            <input className={inputCls} value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <button type="submit" disabled={busy} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-md text-sm transition-colors disabled:opacity-50">
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
}
