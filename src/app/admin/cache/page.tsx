"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

type CacheItem = { key: string; ttl?: number; type?: string; size?: number };

export default function CachePage() {
  const [caches, setCaches] = useState<CacheItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi
      .get("/cache/list")
      .then((r) => setCaches(r.data.caches || []))
      .catch(() => toast.error("Failed to load caches."))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  async function delKey(key: string) {
    const t = toast.loading("Deleting…");
    try {
      await adminApi.delete(`/cache/delete/${encodeURIComponent(key)}`);
      toast.success("Deleted.", { id: t });
      setCaches((prev) => prev.filter((c) => c.key !== key));
    } catch {
      toast.error("Failed.", { id: t });
    }
  }

  async function bulk(path: string, label: string) {
    setBusy(true);
    const t = toast.loading(`Clearing ${label}…`);
    try {
      await adminApi.delete(`/cache/${path}`);
      toast.success(`Cleared ${label}.`, { id: t });
      load();
    } catch {
      toast.error("Failed.", { id: t });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <header className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Cache</h1>
          <p className="text-slate-400 text-sm mt-1">{caches.length} keys cached.</p>
        </div>
        <button onClick={load} className="text-emerald-400 text-sm hover:text-emerald-300">Refresh</button>
      </header>

      <div className="flex flex-wrap gap-3 mb-8">
        <button disabled={busy} onClick={() => bulk("delete-all-posts", "post caches")} className="border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-white px-4 py-2 rounded-md text-xs uppercase tracking-wider disabled:opacity-50">
          Clear post caches
        </button>
        <button disabled={busy} onClick={() => bulk("delete-all-articles", "article caches")} className="border border-slate-700 hover:border-amber-500 text-slate-300 hover:text-white px-4 py-2 rounded-md text-xs uppercase tracking-wider disabled:opacity-50">
          Clear article caches
        </button>
        <button disabled={busy} onClick={() => bulk("delete-all", "all caches")} className="border border-red-800 hover:border-red-500 text-red-300 hover:text-red-200 px-4 py-2 rounded-md text-xs uppercase tracking-wider disabled:opacity-50">
          Clear everything
        </button>
      </div>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : (
        <div className="border border-slate-800 rounded-lg divide-y divide-slate-800">
          {caches.map((c) => (
            <div key={c.key} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="text-slate-200 text-sm font-mono truncate">{c.key}</p>
                {c.ttl != null && <p className="text-slate-500 text-xs">TTL: {c.ttl}s</p>}
              </div>
              <button onClick={() => delKey(c.key)} className="text-slate-500 hover:text-red-400 text-xs uppercase tracking-wider shrink-0 ml-4">
                Delete
              </button>
            </div>
          ))}
          {caches.length === 0 && <p className="px-4 py-6 text-slate-600 text-sm text-center">No caches.</p>}
        </div>
      )}
    </div>
  );
}
