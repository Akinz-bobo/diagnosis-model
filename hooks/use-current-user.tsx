"use client";

import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useAuth } from "./auth-context";
import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";

interface UseCurrentUserOptions {
  required?: boolean;
  redirectTo?: string;
}

export const useCurrentUser = (options: UseCurrentUserOptions = {}) => {
  const { required = false, redirectTo = "/signin" } = options;
  const router = useRouter();
  const { data: session, status, update: updateSession } = useSession();
  const { 
    user: authUser, 
    loading: authLoading, 
    refreshUser,
    error: authError
  } = useAuth();
  
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Enhanced refresh function that updates both auth context and session
  const syncUser = useCallback(async () => {
    if (status === "authenticated") {
      await refreshUser();
      await updateSession(); // Ensure session is also refreshed
    }
  }, [status, refreshUser, updateSession]);
  
  // Check authentication and redirect if needed
  useEffect(() => {
    if (required && 
        !isRedirecting && 
        status === "unauthenticated" && 
        !authLoading) {
      
      setIsRedirecting(true);
      router.replace(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.href)}`);
    }
  }, [required, status, authLoading, router, redirectTo, isRedirecting]);
  
  // Handle token expiry or auth errors
  useEffect(() => {
    if ((session?.error === "TokenExpired" || authError === "TokenExpired") && 
        !isRedirecting) {
      
      setIsRedirecting(true);
      router.replace(`${redirectTo}?callbackUrl=${encodeURIComponent(window.location.href)}&error=expired`);
    }
  }, [session?.error, authError, router, redirectTo, isRedirecting]);

  return {
    // Prefer the more detailed user from auth context if available
    user: authUser || session?.user || null,
    isLoading: status === "loading" || authLoading,
    isAuthenticated: status === "authenticated" && !!authUser,
    session: session as Session | null,
    refreshUser: syncUser,
    error: authError || session?.error,
  };
};
