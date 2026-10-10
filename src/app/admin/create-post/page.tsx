"use client";

import { useEffect, useMemo, useState } from "react";
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

const STREAMING = ["In Theatres", "Netflix", "Prime Video", "JioHotstar", "Apple TV+", "ZEE5", "SonyLIV", "YouTube"];
const RATING_PRESETS = ["Story", "Screenplay", "Direction", "Acting", "Cinematography", "Music", "Editing"];

type Rating = { category: string; score: number };
type PostLite = { id: string; title: string };

const inputCls =
  "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500";
const labelCls = "block text-xs uppercase tracking-wider text-slate-400 mb-2";

export default function CreatePostPage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    directedBy: "",
    streamingAt: "",
    year: "",
    language: "English",
  });
  const [genres, setGenres] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([{ category: "", score: 0 }]);
  const [relatedIds, setRelatedIds] = useState<string[]>([]);
  const [posts, setPosts] = useState<PostLite[]>([]);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    adminApi
      .post("/admin/fetch-posts", {})
      .then((r) => setPosts((r.data.posts || []).map((p: PostLite) => ({ id: p.id, title: p.title }))))
      .catch(() => {});
  }, []);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggleGenre = (g: string) =>
    setGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  const toggleRelated = (id: string) =>
    setRelatedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const filteredPosts = useMemo(
    () => posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())),
    [posts, search]
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error("Title and content are required.");
    if (genres.length === 0) return toast.error("Pick at least one genre.");
    const validRatings = ratings.filter((r) => r.category.trim() !== "" && r.score > 0);

    setSubmitting(true);
    const t = toast.loading("Creating post…");
    try {
      const res = await adminApi.post("/admin/create-post", {
        ...form,
        year: Number.parseInt(form.year) || new Date().getFullYear(),
        genres,
        relatedPostIds: relatedIds,
        ratingCategories: validRatings,
      });
      toast.success(`Post created — ID ${res.data.post?.id?.slice(0, 8) ?? "ok"}`, { id: t });
      setForm({ title: "", content: "", directedBy: "", streamingAt: "", year: "", language: "English" });
      setGenres([]);
      setRatings([{ category: "", score: 0 }]);
      setRelatedIds([]);
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to create post.";
      toast.error(msg, { id: t });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Create Post</h1>
        <p className="text-slate-400 text-sm mt-1">Publish a new film review.</p>
      </header>

      <form onSubmit={submit} className="space-y-8">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className={labelCls}>Title *</label>
            <input className={inputCls} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Film title" />
          </div>
          <div>
            <label className={labelCls}>Directed by</label>
            <input className={inputCls} value={form.directedBy} onChange={(e) => set("directedBy", e.target.value)} placeholder="Director" />
          </div>
          <div>
            <label className={labelCls}>Streaming at</label>
            <input className={inputCls} value={form.streamingAt} onChange={(e) => set("streamingAt", e.target.value)} placeholder="e.g. In Theatres / Netflix" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {STREAMING.map((s) => (
                <button key={s} type="button" onClick={() => set("streamingAt", s)} className={`px-2 py-1 rounded text-[11px] border transition-colors ${form.streamingAt === s ? "border-emerald-500 text-white bg-emerald-500/15" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                  {s}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">Updated automatically each day from JustWatch when the film is found on TMDB; otherwise your value is kept.</p>
          </div>
          <div>
            <label className={labelCls}>Year</label>
            <input className={inputCls} type="number" value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="2026" />
          </div>
          <div>
            <label className={labelCls}>Language</label>
            <select className={inputCls} value={form.language} onChange={(e) => set("language", e.target.value)}>
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelCls}>Content *</label>
          <textarea className={`${inputCls} min-h-[220px] font-mono leading-relaxed`} value={form.content} onChange={(e) => set("content", e.target.value)} placeholder="The review. Separate paragraphs with a blank line." />
          <p className="text-slate-500 text-xs mt-1">Paragraphs are split on blank lines on the public site.</p>
        </div>

        {/* Genres */}
        <div>
          <label className={labelCls}>Genres *</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => toggleGenre(g)}
                className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${
                  genres.includes(g)
                    ? "border-emerald-500 bg-emerald-500/15 text-white"
                    : "border-slate-700 text-slate-400 hover:border-slate-500"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div>
          <label className={labelCls}>Rating categories</label>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {RATING_PRESETS.map((p) => {
              const exists = ratings.some((r) => r.category.toLowerCase() === p.toLowerCase());
              return (
                <button
                  key={p}
                  type="button"
                  disabled={exists}
                  onClick={() =>
                    setRatings((prev) => {
                      const firstEmpty = prev.findIndex((r) => !r.category.trim());
                      if (firstEmpty >= 0) return prev.map((r, i) => (i === firstEmpty ? { ...r, category: p } : r));
                      return [...prev, { category: p, score: 0 }];
                    })
                  }
                  className={`px-2 py-1 rounded text-[11px] border transition-colors ${exists ? "border-slate-800 text-slate-600 cursor-not-allowed" : "border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-white"}`}
                >
                  + {p}
                </button>
              );
            })}
          </div>
          <div className="space-y-3">
            {ratings.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  className={inputCls}
                  placeholder="Category (e.g. Direction)"
                  value={r.category}
                  onChange={(e) => setRatings((prev) => prev.map((x, j) => (j === i ? { ...x, category: e.target.value } : x)))}
                />
                <input
                  className={`${inputCls} w-28`}
                  type="number"
                  min={0}
                  max={100}
                  placeholder="0–100"
                  value={r.score || ""}
                  onChange={(e) => setRatings((prev) => prev.map((x, j) => (j === i ? { ...x, score: Number(e.target.value) } : x)))}
                />
                {ratings.length > 1 && (
                  <button type="button" onClick={() => setRatings((prev) => prev.filter((_, j) => j !== i))} className="text-slate-500 hover:text-red-400 text-sm px-2">
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setRatings((prev) => [...prev, { category: "", score: 0 }])} className="mt-3 text-emerald-400 text-sm hover:text-emerald-300">
            + Add category
          </button>
        </div>

        {/* Related posts */}
        <div>
          <label className={labelCls}>Related posts ({relatedIds.length})</label>
          <input className={`${inputCls} mb-3`} placeholder="Search posts…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="max-h-52 overflow-y-auto border border-slate-800 rounded-md divide-y divide-slate-800">
            {filteredPosts.slice(0, 40).map((p) => (
              <label key={p.id} className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 cursor-pointer">
                <input type="checkbox" checked={relatedIds.includes(p.id)} onChange={() => toggleRelated(p.id)} className="accent-emerald-500" />
                {p.title}
              </label>
            ))}
            {filteredPosts.length === 0 && <p className="px-3 py-3 text-slate-600 text-sm">No posts.</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-md text-sm transition-colors disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Create Post"}
        </button>
      </form>
    </div>
  );
}
