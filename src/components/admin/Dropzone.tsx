"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";

/**
 * Drag-and-drop image uploader with click-to-browse, paste support, and
 * live previews. Controlled: pass `files` + `onChange`.
 */
export default function Dropzone({
  files,
  onChange,
  multiple = false,
  hint = "Drag & drop, click to browse, or paste an image",
  aspect = "aspect-video",
}: {
  files: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  hint?: string;
  aspect?: string;
}) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  const accept = useCallback(
    (list: FileList | File[] | null) => {
      if (!list) return;
      const imgs = Array.from(list).filter((f) => f.type.startsWith("image/"));
      if (imgs.length === 0) return;
      onChange(multiple ? [...files, ...imgs] : [imgs[0]]);
    },
    [files, multiple, onChange]
  );

  // Paste-to-upload (whole-document while hovered would be noisy; use a focusable region)
  const onPaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const imgs: File[] = [];
    for (const it of items) {
      if (it.type.startsWith("image/")) {
        const f = it.getAsFile();
        if (f) imgs.push(f);
      }
    }
    if (imgs.length) {
      e.preventDefault();
      onChange(multiple ? [...files, ...imgs] : [imgs[0]]);
    }
  };

  const remove = (i: number) => onChange(files.filter((_, j) => j !== i));

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onPaste={onPaste}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); accept(e.dataTransfer.files); }}
        className={`cursor-pointer rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors ${
          drag ? "border-emerald-500 bg-emerald-500/10" : "border-slate-700 hover:border-slate-500 bg-slate-900/40"
        }`}
      >
        <UploadCloud className={`mx-auto h-7 w-7 mb-3 ${drag ? "text-emerald-400" : "text-slate-500"}`} />
        <p className="text-sm text-slate-300">{hint}</p>
        <p className="text-xs text-slate-600 mt-1">{multiple ? "PNG, JPG, WEBP — multiple allowed" : "PNG, JPG, WEBP"}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => { accept(e.target.files); e.currentTarget.value = ""; }}
        />
      </div>

      {previews.length > 0 && (
        <div className={`mt-4 grid gap-3 ${multiple ? "grid-cols-3 sm:grid-cols-4" : "grid-cols-1 max-w-xs"}`}>
          {previews.map((src, i) => (
            <div key={i} className={`group relative ${aspect} overflow-hidden rounded-md border border-slate-800 bg-slate-900`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(i); }}
                className="absolute top-1.5 right-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-white transition-opacity"
                aria-label="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
