"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";
import Dropzone from "@/components/admin/Dropzone";

type PostLite = { id: string; title: string; year?: number };

const inputCls =
  "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500";

export default function PostImageUploader({
  title,
  description,
  endpoint,
  fileField,
  multiple = false,
}: {
  title: string;
  description: string;
  endpoint: string;
  fileField: string; // "file" or "files"
  multiple?: boolean;
}) {
  const [posts, setPosts] = useState<PostLite[]>([]);
  const [search, setSearch] = useState("");
  const [postId, setPostId] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    adminApi.post("/admin/fetch-posts", {}).then((r) => setPosts(r.data.posts || [])).catch(() => {});
  }, []);

  const filtered = useMemo(
    () => posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())),
    [posts, search]
  );
  const selected = posts.find((p) => p.id === postId);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!postId) return toast.error("Pick a post first.");
    if (files.length === 0) return toast.error("Choose a file.");
    const fd = new FormData();
    fd.append("postId", postId);
    if (multiple) files.forEach((f) => fd.append(fileField, f));
    else fd.append(fileField, files[0]);

    setBusy(true);
    const t = toast.loading("Uploading…");
    try {
      await adminApi.post(endpoint, fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Uploaded.", { id: t });
      setFiles([]);
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Upload failed.", { id: t });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="text-slate-400 text-sm mt-1">{description}</p>
      </header>

      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">Post</label>
          <input className={`${inputCls} mb-3`} placeholder="Search post…" value={search} onChange={(e) => setSearch(e.target.value)} />
          <div className="max-h-52 overflow-y-auto border border-slate-800 rounded-md divide-y divide-slate-800">
            {filtered.slice(0, 40).map((p) => (
              <button key={p.id} type="button" onClick={() => setPostId(p.id)} className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800/50 ${postId === p.id ? "bg-emerald-500/10 text-white" : "text-slate-300"}`}>
                {p.title} {p.year ? <span className="text-slate-500">· {p.year}</span> : null}
              </button>
            ))}
          </div>
          {selected && <p className="mt-2 text-xs text-emerald-400">Selected: {selected.title}</p>}
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2">
            {multiple ? "Images" : "Image"}
          </label>
          <Dropzone files={files} onChange={setFiles} multiple={multiple} />
        </div>

        <button type="submit" disabled={busy} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-md text-sm transition-colors disabled:opacity-50">
          {busy ? "Uploading…" : "Upload"}
        </button>
      </form>
    </div>
  );
}
