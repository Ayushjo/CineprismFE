"use client";

import { usePathname } from "next/navigation";
import LenisProvider from "@/providers/LenisProvider";

/**
 * Renders the public site chrome (grain, nav, footer, smooth scroll) around
 * page content — but omits all of it on the /admin dashboard, which has its
 * own layout.
 */
export default function Chrome({
  grain,
  nav,
  footer,
  children,
}: {
  grain: React.ReactNode;
  nav: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <LenisProvider>
      {grain}
      {nav}
      <main>{children}</main>
      {footer}
    </LenisProvider>
  );
}
