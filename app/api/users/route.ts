import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type UserProfile = {
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

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/me`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData?.message || "Failed to fetch user" },
        { status: res.status }
      );
    }

    const result = await res.json();

    // Type guard to ensure result matches UserProfile
    const isUserProfile = (data: any): data is UserProfile =>
      data &&
      typeof data.id === "string" &&
      typeof data.email === "string" &&
      typeof data.full_name === "string";

    if (!isUserProfile(result)) {
      return NextResponse.json(
        { message: "Invalid user profile response" },
        { status: 500 }
      );
    }

    return NextResponse.json(result as UserProfile);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
