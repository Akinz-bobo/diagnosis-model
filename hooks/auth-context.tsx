"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { getCurrentToken } from "@/lib/auth";

interface AuthContextType {
  user: any;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sync token from localStorage on mount and on storage change (multi-tab)
  useEffect(() => {
    const syncToken = async() => {
    const token = await getCurrentToken();;
      setToken(token);
    };
    syncToken();
    window.addEventListener("storage", syncToken);
    return () => window.removeEventListener("storage", syncToken);
  }, []);

  // Fetch user when token changes
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        // Optionally send token in Authorization header if your API expects it
        const res = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  // Login: set token in state and localStorage, fetch user
  const login = useCallback(async (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    // Optionally, set cookie here if backend does not do it
    document.cookie = `token=${newToken}; path=/;`;
    // Fetch user will run due to token change
  }, []);

  // Logout: clear state, localStorage, and cookie, redirect
  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    // Remove cookie (if set client-side)
    document.cookie = "token=; Max-Age=0; path=/";
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/signin");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
