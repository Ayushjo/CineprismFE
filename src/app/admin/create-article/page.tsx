"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "@/lib/adminApi";
import Dropzone from "@/components/admin/Dropzone";
import ArticlePreview from "@/components/admin/ArticlePreview";
import { Type, Heading, Image as ImageIcon, List, Quote, Minus, ClipboardPaste, Rows3 } from "lucide-react";

type BlockType = "PARAGRAPH" | "HEADING" | "IMAGE" | "LIST" | "QUOTE" | "DIVIDER";
type Block = {
  id: string; type: BlockType;
  text?: string; level?: number; author?: string;
  ordered?: boolean; items?: string[];
  caption?: string; alt?: string; file?: File | null;
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

const blockButtons: { type: BlockType; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { type: "PARAGRAPH", label: "Paragraph", Icon: Type },
  { type: "HEADING", label: "Heading", Icon: Heading },
  { type: "IMAGE", label: "Image", Icon: ImageIcon },
  { type: "LIST", label: "List", Icon: List },
  { type: "QUOTE", label: "Quote", Icon: Quote },
  { type: "DIVIDER", label: "Divider", Icon: Minus },
];

export default function CreateArticlePage() {
  const [meta, setMeta] = useState({ title: "", shortDescription: "", author: "The Cinéprism", published: true });
  const [mainImage, setMainImage] = useState<File[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([newBlock("PARAGRAPH")]);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [view, setView] = useState<"edit" | "preview">("edit");
  const [submitting, setSubmitting] = useState(false);

  const patch = (id: string, p: Partial<Block>) => setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...p } : b)));
  const remove = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));
  const move = (id: string, dir: -1 | 1) =>
    setBlocks((prev) => {
      const i = prev.findIndex((b) => b.id === id); const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const c = [...prev]; [c[i], c[j]] = [c[j], c[i]]; return c;
    });
  const add = (type: BlockType) => setBlocks((prev) => [...prev, newBlock(type)]);
  // One click → a full section: heading, image, then its paragraph.
  const addSection = () =>
    setBlocks((prev) => [...prev, newBlock("HEADING"), newBlock("IMAGE"), newBlock("PARAGRAPH")]);

  // Paste full text → split into paragraph blocks on blank lines.
  const splitPaste = () => {
    const paras = pasteText.split(/\n\s*\n+/).map((s) => s.trim()).filter(Boolean);
    if (paras.length === 0) return;
    const made = paras.map((t) => ({ ...newBlock("PARAGRAPH"), text: t }));
    setBlocks((prev) => {
      // Replace a single empty starter paragraph, else append.
      const onlyEmptyStarter = prev.length === 1 && prev[0].type === "PARAGRAPH" && !prev[0].text;
      return onlyEmptyStarter ? made : [...prev, ...made];
    });
    setPasteText(""); setPasteOpen(false);
    toast.success(`Added ${made.length} paragraph${made.length > 1 ? "s" : ""}.`);
  };

  async function submit() {
    if (!meta.title.trim()) return toast.error("Title is required.");
    if (mainImage.length === 0) return toast.error("A main image is required.");

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
    fd.append("mainImage", mainImage[0]);
    blocks.forEach((b, i) => { if (b.type === "IMAGE" && b.file) fd.append(`blockImage_${i}`, b.file); });

    setSubmitting(true);
    const t = toast.loading("Publishing article…");
    try {
      const res = await adminApi.post("/articles/create-article", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(`Article created${res.data.article?.slug ? ` — /${res.data.article.slug}` : ""}.`, { id: t });
      setMeta({ title: "", shortDescription: "", author: "The Cinéprism", published: true });
      setMainImage([]); setBlocks([newBlock("PARAGRAPH")]);
    } catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to create article.", { id: t });
    } finally { setSubmitting(false); }
  }

  return (
    <div className="pb-28">
      <div className="p-8 max-w-3xl">
        <header className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Create Article</h1>
            <p className="text-slate-400 text-sm mt-1">Write, drop in images, and publish.</p>
          </div>
          <div className="flex items-center rounded-md border border-slate-700 overflow-hidden shrink-0">
            {(["edit", "preview"] as const).map((v) => (
              <button key={v} type="button" onClick={() => setView(v)} className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors ${view === v ? "bg-emerald-500 text-slate-950 font-semibold" : "text-slate-400 hover:text-white"}`}>
                {v}
              </button>
            ))}
          </div>
        </header>

        {view === "preview" ? (
          <ArticlePreview title={meta.title} deck={meta.shortDescription} author={meta.author} mainImage={mainImage[0] || null} blocks={blocks} />
        ) : (
        <div className="space-y-8">
          {/* Meta */}
          <section className="space-y-5">
            <div>
              <label className={labelCls}>Title *</label>
              <input className={`${inputCls} text-base`} value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} placeholder="Article title" />
            </div>
            <div>
              <label className={labelCls}>Short description (deck)</label>
              <textarea className={`${inputCls} min-h-[70px]`} value={meta.shortDescription} onChange={(e) => setMeta({ ...meta, shortDescription: e.target.value })} placeholder="One or two sentences shown on cards & previews." />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Author</label>
                <input className={inputCls} value={meta.author} onChange={(e) => setMeta({ ...meta, author: e.target.value })} />
              </div>
              <label className="flex items-end gap-2 pb-2 text-sm text-slate-300">
                <input type="checkbox" checked={meta.published} onChange={(e) => setMeta({ ...meta, published: e.target.checked })} className="accent-emerald-500 h-4 w-4" />
                Publish immediately
              </label>
            </div>
          </section>

          {/* Main image */}
          <section>
            <label className={labelCls}>Main image *</label>
            <Dropzone files={mainImage} onChange={setMainImage} hint="Drag & drop the hero image, click, or paste" aspect="aspect-[2.35/1]" />
          </section>

          {/* Quick paste */}
          <section className="border border-slate-800 rounded-lg">
            <button type="button" onClick={() => setPasteOpen((v) => !v)} className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800/40">
              <ClipboardPaste className="h-4 w-4 text-emerald-400" />
              Paste full text — auto-split into paragraphs
            </button>
            {pasteOpen && (
              <div className="p-4 border-t border-slate-800">
                <textarea className={`${inputCls} min-h-[160px] font-mono`} value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder="Paste your whole article here. Blank lines become separate paragraphs." />
                <button type="button" onClick={splitPaste} className="mt-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 rounded-md text-sm">
                  Split into paragraphs
                </button>
              </div>
            )}
          </section>

          {/* Blocks */}
          <section>
            <label className={labelCls}>Content blocks</label>
            <div className="space-y-3">
              {blocks.map((b, i) => (
                <div key={b.id} className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400">{String(i + 1).padStart(2, "0")} · {b.type}</span>
                    <div className="flex items-center gap-1 text-slate-500">
                      <button type="button" onClick={() => move(b.id, -1)} className="hover:text-white px-2 py-0.5">↑</button>
                      <button type="button" onClick={() => move(b.id, 1)} className="hover:text-white px-2 py-0.5">↓</button>
                      <button type="button" onClick={() => remove(b.id)} className="hover:text-red-400 px-2 py-0.5">✕</button>
                    </div>
                  </div>

                  {b.type === "PARAGRAPH" && (
                    <textarea className={`${inputCls} min-h-[110px] font-serif text-base leading-relaxed`} placeholder="Write a paragraph…" value={b.text} onChange={(e) => patch(b.id, { text: e.target.value })} />
                  )}
                  {b.type === "HEADING" && (
                    <div className="flex gap-3">
                      <select className={`${inputCls} w-24`} value={b.level} onChange={(e) => patch(b.id, { level: Number(e.target.value) })}>
                        {[2, 3, 4].map((l) => (<option key={l} value={l}>H{l}</option>))}
                      </select>
                      <input className={`${inputCls} font-serif text-base`} placeholder="Heading" value={b.text} onChange={(e) => patch(b.id, { text: e.target.value })} />
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
                        <input type="checkbox" checked={b.ordered} onChange={(e) => patch(b.id, { ordered: e.target.checked })} className="accent-emerald-500" /> Numbered
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
                      <Dropzone files={b.file ? [b.file] : []} onChange={(fs) => patch(b.id, { file: fs[0] || null })} hint="Drop an image, click, or paste" />
                      <div className="grid sm:grid-cols-2 gap-3">
                        <input className={inputCls} placeholder="Caption" value={b.caption} onChange={(e) => patch(b.id, { caption: e.target.value })} />
                        <input className={inputCls} placeholder="Alt text" value={b.alt} onChange={(e) => patch(b.id, { alt: e.target.value })} />
                      </div>
                    </div>
                  )}
                  {b.type === "DIVIDER" && <p className="text-slate-600 text-sm text-center py-2">— section divider —</p>}
                </div>
              ))}
            </div>

            {/* Add-block toolbar */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={addSection} className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs border border-emerald-500/60 bg-emerald-500/10 text-emerald-300 hover:border-emerald-400 hover:text-white transition-colors">
                <Rows3 className="h-3.5 w-3.5" /> Heading + Image + Text
              </button>
              {blockButtons.map(({ type, label, Icon }) => (
                <button key={type} type="button" onClick={() => add(type)} className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs border border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-white transition-colors">
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              ))}
            </div>
          </section>
        </div>
        )}
      </div>

      {/* Sticky publish bar */}
      <div className="fixed bottom-0 left-60 right-0 border-t border-slate-800 bg-slate-950/95 backdrop-blur px-8 py-4 flex items-center justify-between">
        <p className="text-slate-500 text-sm">{blocks.length} block{blocks.length !== 1 ? "s" : ""} · {mainImage.length ? "image ready" : "no main image"}</p>
        <button type="button" onClick={submit} disabled={submitting} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-8 py-3 rounded-md text-sm transition-colors disabled:opacity-50">
          {submitting ? "Publishing…" : "Publish Article"}
        </button>
      </div>
    </div>
  );
}
