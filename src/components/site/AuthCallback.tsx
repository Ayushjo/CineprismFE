"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const { setAuthToken } = useAuth();
  const [failed, setFailed] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = params.get("token");
    const error = params.get("error");
    if (error || !token) {
      router.replace(`/auth?error=${error || "no_token"}`);
      return;
    }
    setAuthToken(token)
      .then(() => router.replace("/"))
      .catch(() => setFailed(true));
  }, [params, router, setAuthToken]);

  return (
    <div className="text-center px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold mb-6">
        — The Members&rsquo; Entrance
      </p>
      <p className="font-serif italic text-zinc-300 text-2xl">
        {failed ? "Couldn't sign you in. Redirecting…" : "Taking your seat…"}
      </p>
    </div>
  );
}
