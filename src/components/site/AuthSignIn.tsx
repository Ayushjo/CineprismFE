"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

const errorMessages: Record<string, string> = {
  auth_failed: "Google sign-in failed. Please try again.",
  server_error: "Something went wrong on our end. Please try again.",
  oauth_failed: "Google sign-in was cancelled or failed.",
  no_token: "No session was returned. Please try again.",
  callback_failed: "We couldn't complete sign-in. Please try again.",
  admin_required: "Admin access required — sign in with an admin account.",
};

export default function AuthSignIn() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading, loginWithGoogle } = useAuth();
  const error = params.get("error");
  const returnTo = params.get("returnTo") || undefined;

  // Already signed in → send home.
  useEffect(() => {
    if (!loading && user) router.replace("/");
  }, [loading, user, router]);

  return (
    <div data-testid="auth-signin" className="mx-auto w-full max-w-md px-6 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-gold mb-8">
        — The Members&rsquo; Entrance
      </p>
      <h1 className="font-serif font-light text-white text-5xl sm:text-6xl leading-[0.95] tracking-[-0.02em] mb-6">
        Sign in.
      </h1>
      <p className="font-mono text-sm leading-relaxed text-zinc-400 mb-12">
        One tap with Google — to like, comment and keep your seat in the dark.
        No passwords, ever.
      </p>

      {error && (
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.18em] text-red-400 border border-red-500/30 bg-red-500/5 px-4 py-3">
          {errorMessages[error] || "Sign-in failed. Please try again."}
        </p>
      )}

      <button
        type="button"
        onClick={() => loginWithGoogle(returnTo)}
        data-testid="google-signin-btn"
        className="group w-full inline-flex items-center justify-center gap-4 border border-white/25 hover:border-white bg-transparent hover:bg-white px-6 py-5 font-mono text-[11px] uppercase tracking-[0.28em] text-white hover:text-black transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
          <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
        <span>Continue with Google</span>
      </button>

      <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.24em] text-zinc-600">
        By continuing you agree to our terms &amp; privacy policy.
      </p>
    </div>
  );
}
