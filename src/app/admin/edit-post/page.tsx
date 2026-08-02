"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

const GENRES = [
  "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime",
  "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music",
  "Mystery", "Romance", "Sci-Fi", "Sport", "Thriller", "War", "Western",
];
const LANGUAGES = [
  "English", "Hindi", "Korean", "Tamil", "Telugu", "Japanese", "Mandarin",
  "Spanish", "French", "German", "Italian", "Portuguese", "Russian", "Arabic",
  "Bengali", "Marathi", "Gujarati", "Punjabi", "Malayalam", "Kannada", "Urdu",
  "Thai", "Vietnamese", "Indonesian", "Turkish", "Dutch", "Swedish",
  "Norwegian", "Danish", "Finnish",
];

type Rating = { category: string; score: number };
type AdminPost = {
  id: string; title: string; content: string; directedBy?: string; streamingAt?: string;
  year: number; language?: string; genres?: string[]; relatedPostIds?: string[];
  ratingCategories?: Rating[];
};

const inputCls =
  "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500";
const labelCls = "block text-xs uppercase tracking-wider text-slate-400 mb-2";

function EditPostInner() {
  const params = useSearchParams();
  const preId = params.get("id");

  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [selected, setSelected] = useState<AdminPost | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    title: "", content: "", directedBy: "", streamingAt: "", year: "", language: "English",
  });
  const [genres, setGenres] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([{ category: "", score: 0 }]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    adminApi.post("/admin/fetch-posts", {}).then((r) => setPosts(r.data.posts || [])).catch(() => {});
  }, []);

  const pick = (p: AdminPost) => {
    setSelected(p);
    setForm({
      title: p.title || "",
      content: p.content || "",
      directedBy: p.directedBy || "",
      streamingAt: p.streamingAt || "",
      year: String(p.year || ""),
      language: p.language || "English",
    });
    setGenres(p.genres || []);
    const rc = Array.isArray(p.ratingCategories) ? p.ratingCategories : [];
    setRatings(rc.length ? rc : [{ category: "", score: 0 }]);
  };

  // Preselect from ?id=
  useEffect(() => {
    if (preId && !selected) {
      const p = posts.find((x) => x.id === preId);
      if (p) pick(p);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preId, posts]);

  const filtered = useMemo(
    () => posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())),
    [posts, search]
  );

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggleGenre = (g: string) =>
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    const validRatings = ratings.filter((r) => r.category.trim() !== "" && r.score > 0);
    setSubmitting(true);
    const t = toast.loading("Saving…");
    try {
      await adminApi.post("/admin/edit-post", {
        postId: selected.id,
        ...form,
        year: Number.parseInt(form.year) || selected.year,
        genres,
        relatedPostIds: selected.relatedPostIds || [],
        ratingCategories: validRatings,
      });
      toast.success("Post updated.", { id: t });
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update.";
      toast.error(msg, { id: t });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Edit Post</h1>
        <p className="text-slate-400 text-sm mt-1">Select a review and update it.</p>
      </header>

      {/* Picker */}
      <div className="mb-8">
        <label className={labelCls}>Choose a post</label>
        <input className={`${inputCls} mb-3`} placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="max-h-52 overflow-y-auto border border-slate-800 rounded-md divide-y divide-slate-800">
          {filtered.slice(0, 40).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => pick(p)}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800/50 ${selected?.id === p.id ? "bg-emerald-500/10 text-white" : "text-slate-300"}`}
            >
              {p.title} <span className="text-slate-500">· {p.year}</span>
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <form onSubmit={submit} className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className={labelCls}>Title</label>
              <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Directed by</label>
              <input className={inputCls} value={form.directedBy} onChange={(e) => set("directedBy", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Streaming at</label>
              <input className={inputCls} value={form.streamingAt} onChange={(e) => set("streamingAt", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Year</label>
              <input className={inputCls} type="number" value={form.year} onChange={(e) => set("year", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Language</label>
              <select className={inputCls} value={form.language} onChange={(e) => set("language", e.target.value)}>
                {LANGUAGES.map((l) => (<option key={l} value={l}>{l}</option>))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Content</label>
            <textarea className={`${inputCls} min-h-[220px] font-mono leading-relaxed`} value={form.content} onChange={(e) => set("content", e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Genres</label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((g) => (
                <button key={g} type="button" onClick={() => toggleGenre(g)} className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${genres.includes(g) ? "border-emerald-500 bg-emerald-500/15 text-white" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelCls}>Rating categories</label>
            <div className="space-y-3">
              {ratings.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input className={inputCls} placeholder="Category" value={r.category} onChange={(e) => setRatings((prev) => prev.map((x, j) => (j === i ? { ...x, category: e.target.value } : x)))} />
                  <input className={`${inputCls} w-28`} type="number" min={0} max={100} placeholder="0–100" value={r.score || ""} onChange={(e) => setRatings((prev) => prev.map((x, j) => (j === i ? { ...x, score: Number(e.target.value) } : x)))} />
                  {ratings.length > 1 && (
                    <button type="button" onClick={() => setRatings((prev) => prev.filter((_, j) => j !== i))} className="text-slate-500 hover:text-red-400 text-sm px-2">✕</button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setRatings((prev) => [...prev, { category: "", score: 0 }])} className="mt-3 text-emerald-400 text-sm hover:text-emerald-300">
              + Add category
            </button>
          </div>

          <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-md text-sm transition-colors disabled:opacity-50">
            {submitting ? "Saving…" : "Save changes"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function EditPostPage() {
  return (
    <Suspense fallback={<div className="p-8 text-slate-500 text-sm">Loading…</div>}>
      <EditPostInner />
    </Suspense>
  );
}
