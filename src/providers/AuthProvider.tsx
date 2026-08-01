"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User } from "@/types/content";

const API = process.env.NEXT_PUBLIC_API_URL || "https://api.thecineprism.com/api/v1";
const TOKEN_KEY = "cineprism_auth_token";

type AuthState = {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => void;
  logout: () => void;
  setAuthToken: (token: string) => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

async function fetchMe(token: string): Promise<User | null> {
  try {
    const res = await fetch(`${API}/user/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.user ?? data) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe(token).then((u) => {
      if (!u) localStorage.removeItem(TOKEN_KEY);
      setUser(u);
      setLoading(false);
    });
  }, []);

  const loginWithGoogle = useCallback(() => {
    window.location.href = `${API}/auth/google`;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    // Best-effort backend logout (clears cookie); ignore failures.
    fetch(`${API}/user/logout`, { method: "POST", credentials: "include" }).catch(() => {});
  }, []);

  const setAuthToken = useCallback(async (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    const u = await fetchMe(token);
    setUser(u);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
