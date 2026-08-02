"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { FilePlus2, Files, FileText, Star, Mail, Database } from "lucide-react";

const quick = [
  { href: "/admin/create-post", label: "Create Post", desc: "Publish a new review", icon: FilePlus2 },
  { href: "/admin/all-posts", label: "All Posts", desc: "Manage & edit reviews", icon: Files },
  { href: "/admin/create-article", label: "Create Article", desc: "Long-form, block editor", icon: FileText },
  { href: "/admin/add-top-picks", label: "Top Picks", desc: "Curate the shortlist", icon: Star },
  { href: "/admin/newsletter", label: "Newsletter", desc: "Campaigns & subscribers", icon: Mail },
  { href: "/admin/cache", label: "Cache", desc: "Redis cache tools", icon: Database },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div className="p-8">
      <header className="mb-10">
        <p className="text-emerald-400 text-xs uppercase tracking-[0.2em] mb-2">Admin Dashboard</p>
        <h1 className="text-3xl font-semibold text-white">
          Welcome{user?.username ? `, ${user.username}` : ""}.
        </h1>
        <p className="text-slate-400 mt-2">Manage The Cinéprism from here.</p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quick.map(({ href, label, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group border border-slate-800 rounded-lg p-6 bg-slate-900/50 hover:bg-slate-900 hover:border-emerald-500/40 transition-colors"
          >
            <Icon className="h-6 w-6 text-emerald-400 mb-4" />
            <h2 className="text-white font-medium">{label}</h2>
            <p className="text-slate-500 text-sm mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
