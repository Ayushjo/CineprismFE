"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";
import Dropzone from "@/components/admin/Dropzone";

const GENRES = [
  "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
  "Drama", "Fantasy", "History", "Horror", "Mystery", "Romance", "Sci-Fi",
  "Thriller", "War", "Western",
];
const inputCls =
  "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500";
const labelCls = "block text-xs uppercase tracking-wider text-slate-400 mb-2";

export default function AddByGenresPage() {
  const [form, setForm] = useState({ title: "", directedBy: "", synopsis: "", year: "" });
  const [genres, setGenres] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const toggle = (g: string) => setGenres((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required.");
    if (genres.length === 0) return toast.error("Pick at least one genre.");
    if (files.length === 0) return toast.error("A poster is required.");
    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("directedBy", form.directedBy.trim());
    fd.append("synopsis", form.synopsis.trim());
    fd.append("year", form.year || String(new Date().getFullYear()));
    fd.append("genre", JSON.stringify(genres));
    fd.append("file", files[0]);

    setBusy(true);
    const t = toast.loading("Adding…");
    try {
      await adminApi.post("/admin/add-byGenres", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Added to genre collection.", { id: t });
      setForm({ title: "", directedBy: "", synopsis: "", year: "" });
      setGenres([]); setFiles([]);
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed.", { id: t });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Add ByGenres</h1>
        <p className="text-slate-400 text-sm mt-1">Add a curated film to a genre collection.</p>
      </header>
      <form onSubmit={submit} className="space-y-6">
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
            <label className={labelCls}>Year</label>
            <input className={inputCls} type="number" value={form.year} onChange={(e) => set("year", e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Synopsis</label>
          <textarea className={`${inputCls} min-h-[90px]`} value={form.synopsis} onChange={(e) => set("synopsis", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Genres</label>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button key={g} type="button" onClick={() => toggle(g)} className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${genres.includes(g) ? "border-emerald-500 bg-emerald-500/15 text-white" : "border-slate-700 text-slate-400 hover:border-slate-500"}`}>
                {g}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelCls}>Poster</label>
          <Dropzone files={files} onChange={setFiles} aspect="aspect-[2/3]" />
        </div>
        <button type="submit" disabled={busy} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-md text-sm transition-colors disabled:opacity-50">
          {busy ? "Adding…" : "Add Film"}
        </button>
      </form>
    </div>
  );
}
