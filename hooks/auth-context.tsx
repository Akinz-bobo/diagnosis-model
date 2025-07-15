"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  organization_id?: string;
  phone?: string;
  [key: string]: any; // For any additional fields
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status, update: updateSession } = useSession();

  // Request tracking to prevent excessive API calls
  const lastFetchTimeRef = useRef<number>(0);
  const fetchingRef = useRef<boolean>(false);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear any pending timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, []);
  
  // Simple user fetch implementation
  const fetchUser = useCallback(async (force = false) => {
    const now = Date.now();
    const minInterval = 3000; // 3 seconds minimum between requests
    
    // Skip if already fetching or too soon unless forced
    if (fetchingRef.current || (!force && (now - lastFetchTimeRef.current < minInterval))) {
      return;
    }
    
    // Skip if session is definitely not authenticated
    if (status === "unauthenticated") {
      setUser(null);
      setLoading(false);
      return;
    }
    
    fetchingRef.current = true;
    setLoading(true);
    
    try {
      // Add a random query parameter to prevent caching
      const timestamp = Date.now();
      const res = await fetch(`/api/auth/me?_t=${timestamp}`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache, no-store",
          "Pragma": "no-cache"
        },
        cache: "no-store"
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUser(data);
        setError(null);
      } else {
        if (res.status === 401 || res.status === 403) {
          // Don't automatically sign out on auth errors - just log them and clear user
          console.log("Auth error detected:", data.error);
          setUser(null);
          // No automatic signOut here to prevent logout loops
        } else {
          console.error("Error fetching user:", data.error || "Unknown error");
          setError(data.error || "Failed to fetch user data");
        }
      }
    } catch (err) {
      console.error("Error in fetchUser:", err);
      setError("Network or server error");
    } finally {
      lastFetchTimeRef.current = Date.now();
      fetchingRef.current = false;
      setLoading(false);
    }
  }, [session, status]);

  // Initialize user data when session changes
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Set basic user info from session immediately
      setUser(session.user as User);
      
      // Only fetch detailed user data once when session becomes authenticated
      // or if user data is missing
      if (!user || !user.id) {
        fetchUser();
      }
    } else if (status === "unauthenticated") {
      setUser(null);
      setLoading(false);
    }
    
    // Only check for explicit session errors like TokenExpired
    // but don't auto-logout for normal authentication state changes
    if (session?.error === "TokenExpired") {
      console.log("Session expired error detected");
      // Don't auto-logout here either - let the user handle it
    }
  }, [session, status, fetchUser, user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setError(result.error);
        return { success: false, error: result.error };
      }
      
      if (result?.ok) {
        // Session will update automatically through the useSession hook
        return { success: true };
      }
      
      return { success: false, error: "Unknown error occurred" };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      // Clear any pending fetch timeouts
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
      
      // Clear user state first for immediate UI feedback
      setUser(null);
      
      // Then sign out from NextAuth with redirect to homepage
      await signOut({ 
        redirect: true,
        callbackUrl: "/"
      });
      
    } catch (error) {
      console.error("Logout error:", error);
      setError("Failed to logout");
      setLoading(false);
    }
    // No finally block with setLoading(false) since we're redirecting
  };

  const refreshUser = async () => {
    return fetchUser(true);
  };

  const contextValue: AuthContextType = {
    user,
    loading: loading || status === "loading",
    error,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default function NextAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider 
      refetchOnWindowFocus={false}
      refetchInterval={0}
      refetchWhenOffline={false}
    >
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}
