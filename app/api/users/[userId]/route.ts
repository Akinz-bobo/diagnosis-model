import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Readable } from "stream";

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

// GET /api/users/[userId] - Get user detail
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
    const res = await fetch(`${base}/api/v1/users/${session.user.id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        {
          message:
            errorData?.detail || errorData?.message || "Failed to fetch user",
        },
        { status: res.status }
      );
    }
    const user = await res.json();
    // Type guard for UserProfile
    const isUserProfile = (data: any): data is UserProfile =>
      data &&
      typeof data.id === "string" &&
      typeof data.email === "string" &&
      typeof data.full_name === "string";
    if (!isUserProfile(user)) {
      return NextResponse.json(
        { message: "Invalid user profile response" },
        { status: 500 }
      );
    }
    return NextResponse.json(user as UserProfile);
  } catch (error) {
    console.error("Error fetching user detail:", error);
    return NextResponse.json(
      { message: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[userId] - Update user (form-data)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
    const backendRes = await fetch(`${base}/api/v1/users/${params.userId}`, {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        {
          message:
            errorData?.detail || errorData?.message || "Failed to update user",
        },
        { status: backendRes.status }
      );
    }
    const updatedUser = await backendRes.json();
    // Type guard for UserProfile
    const isUserProfile = (data: any): data is UserProfile =>
      data &&
      typeof data.id === "string" &&
      typeof data.email === "string" &&
      typeof data.full_name === "string";
    if (!isUserProfile(updatedUser)) {
      return NextResponse.json(
        { message: "Invalid user profile response" },
        { status: 500 }
      );
    }
    return NextResponse.json(updatedUser as UserProfile);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

// POST /api/users/[userId]/suspend - Suspend user
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
    const res = await fetch(`${base}/api/v1/users/${params.userId}/suspend`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        {
          message:
            errorData?.detail || errorData?.message || "Failed to suspend user",
        },
        { status: res.status }
      );
    }
    const user = await res.json();
    // Type guard for UserProfile
    const isUserProfile = (data: any): data is UserProfile =>
      data &&
      typeof data.id === "string" &&
      typeof data.email === "string" &&
      typeof data.full_name === "string";
    if (!isUserProfile(user)) {
      return NextResponse.json(
        { message: "Invalid user profile response" },
        { status: 500 }
      );
    }
    return NextResponse.json(user as UserProfile);
  } catch (error) {
    console.error("Error suspending user:", error);
    return NextResponse.json(
      { message: "Failed to suspend user" },
      { status: 500 }
    );
  }
}

// POST /api/users/[userId]/promote - Promote user to admin
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
    const res = await fetch(`${base}/api/v1/users/${params.userId}/promote`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        {
          message:
            errorData?.detail || errorData?.message || "Failed to promote user",
        },
        { status: res.status }
      );
    }
    const user = await res.json();
    // Type guard for UserProfile
    const isUserProfile = (data: any): data is UserProfile =>
      data &&
      typeof data.id === "string" &&
      typeof data.email === "string" &&
      typeof data.full_name === "string";
    if (!isUserProfile(user)) {
      return NextResponse.json(
        { message: "Invalid user profile response" },
        { status: 500 }
      );
    }
    return NextResponse.json(user as UserProfile);
  } catch (error) {
    console.error("Error promoting user:", error);
    return NextResponse.json(
      { message: "Failed to promote user" },
      { status: 500 }
    );
  }
}

// GET /api/users/organization/[orgId] - Get users by organization
export async function GET_ORG(
  request: NextRequest,
  { params }: { params: { orgId: string } }
) {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
    const res = await fetch(
      `${base}/api/v1/users/organization/${params.orgId}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        {
          message:
            errorData?.detail ||
            errorData?.message ||
            "Failed to fetch users by organization",
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
    console.error("Error fetching users by organization:", error);
    return NextResponse.json(
      { message: "Failed to fetch users by organization" },
      { status: 500 }
    );
  }
}
