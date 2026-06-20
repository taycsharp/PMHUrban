"use client";

import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

type AuthUser = { id: number; email: string; full_name: string; role: string };

type AuthContextValue = {
  user: AuthUser | null;
  ready: boolean;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedToken = window.localStorage.getItem("pmh_access_token");
    const storedUser = window.localStorage.getItem("pmh_user");
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        window.localStorage.removeItem("pmh_user");
      }
    }
    setReady(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      token,
      isAuthenticated: Boolean(token && user),
      async login(email, password) {
        const response = await api.post("/auth/login", { email, password });
        window.localStorage.setItem("pmh_access_token", response.data.access_token);
        window.localStorage.setItem("pmh_user", JSON.stringify(response.data.user));
        setToken(response.data.access_token);
        setUser(response.data.user);
      },
      logout() {
        window.localStorage.removeItem("pmh_access_token");
        window.localStorage.removeItem("pmh_user");
        setToken(null);
        setUser(null);
      }
    }),
    [ready, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
