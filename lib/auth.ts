"use server";
import type { User } from "@/lib/types";
import { cookies } from "next/headers";
// This is a mock implementation for demonstration purposes
// In a real application, this would interact with your authentication system
export async function getCurrentUser(): Promise<User | null> {
  return {
    id: "1",
    image: "https://placeholder.png",
    email: "user@example.com",
    full_name: "John Doe",
    role: "admin",
    emailVerified: true,
    createdAt: new Date().toISOString(),
  };
}

export const getCurrentToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;
  return token;
};
