"use client";

import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { api } from "@/lib/api";

type AuthUser = { id: number; email: string; full_name: string; role: string };

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      async login(email, password) {
        const response = await api.post("/auth/login", { email, password });
        window.localStorage.setItem("pmh_access_token", response.data.access_token);
        setUser(response.data.user);
      },
      logout() {
        window.localStorage.removeItem("pmh_access_token");
        setUser(null);
      }
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

