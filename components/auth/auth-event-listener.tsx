"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/hooks/auth-context";
import { useRouter } from "next/navigation";

// This component listens to auth events and keeps the app in sync
export default function AuthEventListener() {
  const { status, data: session } = useSession();
  const { refreshUser, user } = useAuth();
  const router = useRouter();
  
  // Use refs to track state between renders
  const prevStatusRef = useRef<string | null>(null);
  const lastRefreshRef = useRef<number>(0);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced refresh function to prevent multiple rapid refreshes
  const debouncedRefresh = useCallback(() => {
    const now = Date.now();
    const COOLDOWN = 5000; // 5 seconds between refreshes
    
    // Clear any pending timeout
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
    }
    
    // If we've refreshed recently, schedule one for later
    if (now - lastRefreshRef.current < COOLDOWN) {
      const delay = COOLDOWN - (now - lastRefreshRef.current);
      
      refreshTimeoutRef.current = setTimeout(() => {
        lastRefreshRef.current = Date.now();
        refreshUser();
      }, delay);
      
      return;
    }
    
    // Otherwise refresh now
    lastRefreshRef.current = now;
    refreshUser();
  }, [refreshUser]);

  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // Listen to session status changes
  useEffect(() => {
    // Skip initial execution to prevent unnecessary refresh on mount
    if (prevStatusRef.current === null) {
      prevStatusRef.current = status;
      return;
    }
    
    // Handle status changes
    if (status === "authenticated" && session?.user) {
      // Only refresh if status actually changed or we don't have user data
      if (prevStatusRef.current !== "authenticated" || !user) {
        console.log("Session authenticated, syncing user data");
        debouncedRefresh();
      }
    } else if (status === "unauthenticated") {
      // If previously authenticated but now not, we might need to redirect
      if (prevStatusRef.current === "authenticated") {
        console.log("Session is no longer authenticated");
        
        // Optional: redirect to login page for protected routes
        const isProtectedPath = window.location.pathname.startsWith('/dashboard') || 
                               window.location.pathname.startsWith('/profile');
        
        if (isProtectedPath) {
          router.push('/signin');
        }
      }
    }
    
    // Update previous status
    prevStatusRef.current = status;
  }, [status, session, user, debouncedRefresh, router]);

  // Also listen for explicit session errors
  useEffect(() => {
    if (session?.error === "TokenExpired") {
      console.log("Token expired, redirecting to login");
      router.push('/signin');
    }
  }, [session?.error, router]);

  // This is just a listener component, it doesn't render anything
  return null;
}
