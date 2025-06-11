"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Session as NextAuthSession } from "next-auth";

// Extend the Session type to include 'role' in user
type Session = NextAuthSession & {
  user?: NextAuthSession["user"] & { role?: "ADMIN" | "USER" };
};

function hasRole(
  user: Session["user"]
): user is Session["user"] & { role: "ADMIN" | "USER" } {
  return !!user && typeof user.role === "string";
}

export function AuthGuard({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: "ADMIN" | "USER";
}) {
  const { data: session, status } = useSession() as {
    data: Session | null;
    status: string;
  };
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/signin");
    else if (
      role &&
      (!session?.user || !hasRole(session.user) || session.user.role !== role)
    )
      router.replace("/dashboard");
  }, [status, session, role, router]);

  if (status === "loading") return <p>Loading...</p>;
  return <>{children}</>;
}
