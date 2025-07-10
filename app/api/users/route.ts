import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  state: string | null;
  profession: string | null;
  gender: string | null;
  bio: string | null;
  image: string | null;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  organization_id: string | null;
};

// GET /api/users - Get all users (admin only)
export async function GET() {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
    const res = await fetch(`${base}/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        {
          message:
            errorData?.detail || errorData?.message || "Failed to fetch users",
        },
        { status: res.status }
      );
    }
    const users = await res.json();
    if (!Array.isArray(users)) {
      return NextResponse.json(
        { message: "Invalid users response" },
        { status: 500 }
      );
    }
    // Type guard for UserProfile[]
    const isUserProfile = (data: any): data is UserProfile =>
      data &&
      typeof data.id === "string" &&
      typeof data.email === "string" &&
      typeof data.full_name === "string";
    if (!users.every(isUserProfile)) {
      return NextResponse.json(
        { message: "Invalid user profile in response" },
        { status: 500 }
      );
    }
    return NextResponse.json(users as UserProfile[]);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
