"use client";

import type { User } from "@/lib/types";
import { useEffect, useState } from "react";

// This is a client-side hook to get the current user
// In a real application, this would use a context provider or similar
export const useCurrentUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/v1/auth/me");
        if (!response.ok) throw new Error("Failed to fetch user");
        const data: User = await response.json();
        setUser(data);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading };
};
