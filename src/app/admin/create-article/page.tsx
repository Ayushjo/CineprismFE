"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";

type BlockType = "PARAGRAPH" | "HEADING" | "IMAGE" | "LIST" | "QUOTE" | "DIVIDER";
type Block = {
  id: string;
  type: BlockType;
  text?: string;
  level?: number;
  author?: string;
  ordered?: boolean;
  items?: string[];
  caption?: string;
  alt?: string;
  file?: File | null;
  preview?: string;
};

const inputCls =
  "w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500";
const labelCls = "block text-xs uppercase tracking-wider text-slate-400 mb-2";
const uid = () => Math.random().toString(36).slice(2, 9);

const newBlock = (type: BlockType): Block => {
  const base = { id: uid(), type };
  if (type === "HEADING") return { ...base, text: "", level: 2 };
  if (type === "LIST") return { ...base, ordered: false, items: [""] };
  if (type === "QUOTE") return { ...base, text: "", author: "" };
  if (type === "IMAGE") return { ...base, caption: "", alt: "", file: null };
  return { ...base, text: "" };
};

export default function CreateArticlePage() {
  const [meta, setMeta] = useState({ title: "", shortDescription: "", author: "The Cinéprism", published: true });
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string>("");
  const [blocks, setBlocks] = useState<Block[]>([newBlock("PARAGRAPH")]);
  const [submitting, setSubmitting] = useState(false);

  const patch = (id: string, p: Partial<Block>) => setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...p } : b)));
  const remove = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));
  const move = (id: string, dir: -1 | 1) =>
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const copy = [...prev];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  const add = (type: BlockType) => setBlocks((prev) => [...prev, newBlock(type)]);

  function setBlockFile(id: string, file: File | null) {
    patch(id, { file, preview: file ? URL.createObjectURL(file) : "" });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!meta.title.trim()) return toast.error("Title is required.");
    if (!mainImage) return toast.error("A main image is required.");

    // Serialize blocks (content only; files go as separate form fields).
    const serial = blocks.map((b) => {
      if (b.type === "PARAGRAPH" || b.type === "HEADING")
        return { type: b.type, content: { text: b.text || "", ...(b.type === "HEADING" ? { level: b.level || 2 } : {}) } };
      if (b.type === "QUOTE") return { type: b.type, content: { text: b.text || "", author: b.author || "" } };
      if (b.type === "LIST") return { type: b.type, content: { type: b.ordered ? "numbered" : "bulleted", items: (b.items || []).filter(Boolean) } };
      if (b.type === "IMAGE") return { type: b.type, content: { caption: b.caption || "", alt: b.alt || "" } };
      return { type: "DIVIDER", content: {} };
    });

    const fd = new FormData();
    fd.append("title", meta.title);
    fd.append("shortDescription", meta.shortDescription);
    fd.append("author", meta.author);
    fd.append("published", String(meta.published));
    fd.append("blocks", JSON.stringify(serial));
    fd.append("mainImage", mainImage);
    blocks.forEach((b, i) => {
      if (b.type === "IMAGE" && b.file) fd.append(`blockImage_${i}`, b.file);
    });

    setSubmitting(true);
    const t = toast.loading("Publishing article…");
    try {
      const res = await adminApi.post("/articles/create-article", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(`Article created${res.data.article?.slug ? ` — /${res.data.article.slug}` : ""}.`, { id: t });
      setMeta({ title: "", shortDescription: "", author: "The Cinéprism", published: true });
      setMainImage(null); setMainPreview("");
      setBlocks([newBlock("PARAGRAPH")]);
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create article.";
      toast.error(msg, { id: t });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Create Article</h1>
        <p className="text-slate-400 text-sm mt-1">Long-form, block by block.</p>
      </header>

      <form onSubmit={submit} className="space-y-8">
        {/* Meta */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className={labelCls}>Title *</label>
            <input className={inputCls} value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} placeholder="Article title" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Short description (deck)</label>
            <textarea className={`${inputCls} min-h-[70px]`} value={meta.shortDescription} onChange={(e) => setMeta({ ...meta, shortDescription: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>Author</label>
            <input className={inputCls} value={meta.author} onChange={(e) => setMeta({ ...meta, author: e.target.value })} />
          </div>
          <div className="flex items-end gap-2 pb-2">
            <input id="pub" type="checkbox" checked={meta.published} onChange={(e) => setMeta({ ...meta, published: e.target.checked })} className="accent-emerald-500 h-4 w-4" />
            <label htmlFor="pub" className="text-sm text-slate-300">Published</label>
          </div>
        </div>

        {/* Main image */}
        <div>
          <label className={labelCls}>Main image *</label>
          <input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0] || null; setMainImage(f); setMainPreview(f ? URL.createObjectURL(f) : ""); }} className="text-sm text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-slate-200" />
          {mainPreview && <img src={mainPreview} alt="" className="mt-3 h-40 w-auto rounded-md border border-slate-800 object-cover" />}
        </div>

        {/* Blocks */}
        <div>
          <label className={labelCls}>Content blocks</label>
          <div className="space-y-4">
            {blocks.map((b, i) => (
              <div key={b.id} className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400">{b.type}</span>
                  <div className="flex items-center gap-2 text-slate-500">
                    <button type="button" onClick={() => move(b.id, -1)} className="hover:text-white px-1">↑</button>
                    <button type="button" onClick={() => move(b.id, 1)} className="hover:text-white px-1">↓</button>
                    <button type="button" onClick={() => remove(b.id)} className="hover:text-red-400 px-1">✕</button>
                  </div>
                </div>

                {(b.type === "PARAGRAPH") && (
                  <textarea className={`${inputCls} min-h-[100px] font-mono`} placeholder="Paragraph text…" value={b.text} onChange={(e) => patch(b.id, { text: e.target.value })} />
                )}
                {b.type === "HEADING" && (
                  <div className="flex gap-3">
                    <select className={`${inputCls} w-24`} value={b.level} onChange={(e) => patch(b.id, { level: Number(e.target.value) })}>
                      {[2, 3, 4].map((l) => (<option key={l} value={l}>H{l}</option>))}
                    </select>
                    <input className={inputCls} placeholder="Heading text" value={b.text} onChange={(e) => patch(b.id, { text: e.target.value })} />
                  </div>
                )}
                {b.type === "QUOTE" && (
                  <div className="space-y-3">
                    <textarea className={`${inputCls} min-h-[70px] font-serif italic`} placeholder="Quote…" value={b.text} onChange={(e) => patch(b.id, { text: e.target.value })} />
                    <input className={inputCls} placeholder="Attribution (optional)" value={b.author} onChange={(e) => patch(b.id, { author: e.target.value })} />
                  </div>
                )}
                {b.type === "LIST" && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      <input type="checkbox" checked={b.ordered} onChange={(e) => patch(b.id, { ordered: e.target.checked })} className="accent-emerald-500" />
                      Numbered
                    </label>
                    {(b.items || []).map((it, k) => (
                      <div key={k} className="flex gap-2">
                        <input className={inputCls} placeholder={`Item ${k + 1}`} value={it} onChange={(e) => patch(b.id, { items: (b.items || []).map((x, j) => (j === k ? e.target.value : x)) })} />
                        <button type="button" onClick={() => patch(b.id, { items: (b.items || []).filter((_, j) => j !== k) })} className="text-slate-500 hover:text-red-400 px-2">✕</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => patch(b.id, { items: [...(b.items || []), ""] })} className="text-emerald-400 text-sm hover:text-emerald-300">+ Item</button>
                  </div>
                )}
                {b.type === "IMAGE" && (
                  <div className="space-y-3">
                    <input type="file" accept="image/*" onChange={(e) => setBlockFile(b.id, e.target.files?.[0] || null)} className="text-sm text-slate-400 file:mr-3 file:rounded-md file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-slate-200" />
                    {b.preview && <img src={b.preview} alt="" className="h-32 w-auto rounded-md border border-slate-800 object-cover" />}
                    <input className={inputCls} placeholder="Caption" value={b.caption} onChange={(e) => patch(b.id, { caption: e.target.value })} />
                    <input className={inputCls} placeholder="Alt text" value={b.alt} onChange={(e) => patch(b.id, { alt: e.target.value })} />
                  </div>
                )}
                {b.type === "DIVIDER" && <p className="text-slate-600 text-sm">— section divider —</p>}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {(["PARAGRAPH", "HEADING", "IMAGE", "LIST", "QUOTE", "DIVIDER"] as BlockType[]).map((t) => (
              <button key={t} type="button" onClick={() => add(t)} className="px-3 py-1.5 rounded-md text-xs border border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-white transition-colors">
                + {t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-6 py-3 rounded-md text-sm transition-colors disabled:opacity-50">
          {submitting ? "Publishing…" : "Publish Article"}
        </button>
      </form>
    </div>
  );
}
