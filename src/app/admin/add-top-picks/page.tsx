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

export default function AddTopPicksPage() {
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [genre, setGenre] = useState("Drama");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required.");
    if (files.length === 0) return toast.error("A poster is required.");
    const fd = new FormData();
    fd.append("title", title.trim());
    fd.append("year", year || String(new Date().getFullYear()));
    fd.append("genre", genre);
    fd.append("file", files[0]);

    setBusy(true);
    const t = toast.loading("Adding pick…");
    try {
      await adminApi.post("/admin/create-top-picks", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Top pick added.", { id: t });
      setTitle(""); setYear(""); setFiles([]);
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed.", { id: t });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Add Top Pick</h1>
        <p className="text-slate-400 text-sm mt-1">Curate a film for the shortlist.</p>
      </header>
      <form onSubmit={submit} className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className={labelCls}>Title</label>
            <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Year</label>
            <input className={inputCls} type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="1997" />
          </div>
          <div>
            <label className={labelCls}>Genre</label>
            <select className={inputCls} value={genre} onChange={(e) => setGenre(e.target.value)}>
              {GENRES.map((g) => (<option key={g} value={g}>{g}</option>))}
            </select>
          </div>
        </div>
        <div>
          <label className={labelCls}>Poster (vertical)</label>
          <Dropzone files={files} onChange={setFiles} aspect="aspect-[2/3]" />
        </div>
        <button type="submit" disabled={busy} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-md text-sm transition-colors disabled:opacity-50">
          {busy ? "Adding…" : "Add Top Pick"}
        </button>
      </form>
    </div>
  );
}
