"use client";

import { useSession } from "next-auth/react";
import { Session } from "next-auth";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  return {
    user: session?.user ?? null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    session: session as Session | null,
  };
};
