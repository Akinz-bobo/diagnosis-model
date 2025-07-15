import { getServerSession } from "next-auth";
import { authOptions } from "./auth-config";

export function auth() {
  return getServerSession(authOptions);
}

export const getCurrentUser = async () => {
  const session = await auth();
  return session?.user;
};

// Check if the user is authenticated and has a specific role
export const checkUserRole = async (requiredRoles: string | string[]) => {
  const session = await auth();
  
  if (!session) {
    return false;
  }
  
  if (!session.user?.role) {
    return false;
  }
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(session.user.role);
  }
  
  return session.user.role === requiredRoles;
};

// Helper for API routes to check authentication
export const isAuthenticated = async () => {
  const session = await auth();
  return !!session?.user;
};
