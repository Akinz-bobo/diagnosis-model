"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import type { ReactNode } from "react";

interface UserRoleGateProps {
  children: ReactNode;
  allowedRoles: string[];
}

export function UserRoleGate({ children, allowedRoles }: UserRoleGateProps) {
  const user = useCurrentUser();

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
