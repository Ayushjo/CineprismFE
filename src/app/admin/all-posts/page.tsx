"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

type AdminPost = {
  id: string;
  title: string;
  year: number;
  genres: string[];
  directedBy?: string;
  viewCount?: number;
};

const inputCls =
  "bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500";

export default function AllPostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    adminApi
      .post("/admin/fetch-posts", {})
      .then((r) => setPosts(r.data.posts || []))
      .catch(() => toast.error("Failed to load posts."))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const genres = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => (p.genres || []).forEach((g) => s.add(g)));
    return [...s].sort();
  }, [posts]);

  const filtered = useMemo(
    () =>
      posts.filter((p) => {
        if (genre && !(p.genres || []).includes(genre)) return false;
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [posts, search, genre]
  );

  async function remove(id: string) {
    setDeleting(id);
    const t = toast.loading("Deleting…");
    try {
      await adminApi.post("/admin/delete-post", { postId: id });
      toast.success("Post deleted.", { id: t });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error("Failed to delete.", { id: t });
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  }

  return (
    <div className="p-8">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">All Posts</h1>
          <p className="text-slate-400 text-sm mt-1">{posts.length} reviews on file.</p>
        </div>
        <div className="flex items-center gap-3">
          <input className={inputCls} placeholder="Search title…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className={inputCls} value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">All genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </header>

      {loading ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : (
        <div className="border border-slate-800 rounded-lg overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Year</th>
                <th className="text-left px-4 py-3 font-medium">Genres</th>
                <th className="text-left px-4 py-3 font-medium">Views</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50">
                  <td className="px-4 py-3 text-white">{p.title}</td>
                  <td className="px-4 py-3 text-slate-400">{p.year}</td>
                  <td className="px-4 py-3 text-slate-400">{(p.genres || []).slice(0, 3).join(", ")}</td>
                  <td className="px-4 py-3 text-slate-400">{p.viewCount ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/admin/edit-post?id=${p.id}`} className="text-emerald-400 hover:text-emerald-300 text-xs uppercase tracking-wider">
                        Edit
                      </Link>
                      {confirmId === p.id ? (
                        <span className="flex items-center gap-2">
                          <button onClick={() => remove(p.id)} disabled={deleting === p.id} className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider disabled:opacity-50">
                            {deleting === p.id ? "…" : "Confirm"}
                          </button>
                          <button onClick={() => setConfirmId(null)} className="text-slate-500 hover:text-slate-300 text-xs">Cancel</button>
                        </span>
                      ) : (
                        <button onClick={() => setConfirmId(p.id)} className="text-slate-500 hover:text-red-400 text-xs uppercase tracking-wider">
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-slate-600 text-center">No posts match.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
