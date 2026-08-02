"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  FilePlus2, Files, FileText, Quote, Layers, ImageUp, Images, Film,
  Star, TrendingUp, Mail, Database, LogOut, Home,
} from "lucide-react";

type Item = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };
type Group = { title: string; items: Item[] };

const groups: Group[] = [
  {
    title: "Content",
    items: [
      { href: "/admin/create-post", label: "Create Post", icon: FilePlus2 },
      { href: "/admin/all-posts", label: "All Posts", icon: Files },
      { href: "/admin/create-article", label: "Create Article", icon: FileText },
      { href: "/admin/add-bygenres", label: "Add ByGenres", icon: Layers },
    ],
  },
  {
    title: "Media",
    items: [
      { href: "/admin/upload-poster", label: "Upload Poster", icon: ImageUp },
      { href: "/admin/upload-review-poster", label: "Review Poster", icon: Film },
      { href: "/admin/upload-gallery", label: "Upload Gallery", icon: Images },
    ],
  },
  {
    title: "Curation",
    items: [
      { href: "/admin/add-top-picks", label: "Top Picks", icon: Star },
      { href: "/admin/edit-rank", label: "Trending Rank", icon: TrendingUp },
      { href: "/admin/create-quote", label: "Create Quote", icon: Quote },
      { href: "/admin/edit-quote", label: "Edit Quote", icon: Quote },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
      { href: "/admin/cache", label: "Cache", icon: Database },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-60 shrink-0 border-r border-slate-800 bg-slate-900/80 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center text-white font-bold text-xs">
          CP
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">Cinéprism</p>
          <p className="text-slate-500 text-[11px]">Admin Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {groups.map((g) => (
          <div key={g.title}>
            <p className="px-3 mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-600">{g.title}</p>
            <ul className="space-y-1">
              {g.items.map((it) => {
                const active = pathname === it.href;
                const Icon = it.icon;
                return (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                        active
                          ? "bg-emerald-500/15 text-white"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${active ? "text-emerald-400" : ""}`} />
                      {it.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link href="/" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-slate-800/60 hover:text-white transition-colors">
          <Home className="h-4 w-4" /> View site
        </Link>
        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
