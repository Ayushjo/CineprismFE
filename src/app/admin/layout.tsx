import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin — The Cinéprism",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex">
        <AdminSidebar />
        <div className="flex-1 min-w-0">{children}</div>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              border: "1px solid rgba(148,163,184,0.2)",
              fontSize: "14px",
            },
          }}
        />
      </div>
    </AdminGuard>
  );
}
