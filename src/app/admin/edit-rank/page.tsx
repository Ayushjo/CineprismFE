"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

type Movie = { id: number; title: string; trending_rank?: number; release_date?: string };

export default function TrendingRankPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .get("/movies")
      .then((r) => setMovies((r.data.data || []).sort((a: Movie, b: Movie) => (a.trending_rank || 0) - (b.trending_rank || 0))))
      .catch(() => toast.error("Failed to load movies."))
      .finally(() => setLoading(false));
  }, []);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= movies.length) return;
    const copy = [...movies];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    setMovies(copy);
  };

  async function save() {
    setSaving(true);
    const t = toast.loading("Saving ranks…");
    try {
      const movieData = movies.map((m, i) => ({ id: m.id, trendingRank: i + 1 }));
      await adminApi.post("/movies/edit-rank", { movieData });
      toast.success("Ranks updated.", { id: t });
    } catch {
      toast.error("Failed to save.", { id: t });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <header className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Trending Rank</h1>
          <p className="text-slate-400 text-sm mt-1">Reorder the trending movies chart.</p>
        </div>
        <button onClick={save} disabled={saving || loading} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-2.5 rounded-md text-sm transition-colors disabled:opacity-50">
          {saving ? "Saving…" : "Save order"}
        </button>
      </header>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : (
        <ol className="border border-slate-800 rounded-lg divide-y divide-slate-800">
          {movies.map((m, i) => (
            <li key={m.id} className="flex items-center gap-4 px-4 py-3">
              <span className="w-8 text-center font-mono text-emerald-400">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1 text-slate-200 text-sm truncate">
                {m.title} {m.release_date ? <span className="text-slate-500">· {new Date(m.release_date).getFullYear()}</span> : null}
              </span>
              <div className="flex items-center gap-1 text-slate-500">
                <button onClick={() => move(i, -1)} className="hover:text-white px-2 py-1">↑</button>
                <button onClick={() => move(i, 1)} className="hover:text-white px-2 py-1">↓</button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
