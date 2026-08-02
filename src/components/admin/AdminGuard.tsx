"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

/** Gates the admin section to signed-in ADMIN users. */
export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth?error=admin_required");
    else if (user.role !== "ADMIN") router.replace("/");
  }, [user, loading, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-950 text-slate-400">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
          <p className="font-mono text-xs uppercase tracking-[0.3em]">
            {loading ? "Checking access…" : "Redirecting…"}
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
