import { type NextRequest, NextResponse } from "next/server";
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
export type TeamOut = {
  id: string;
  name: string;
  organization_id: string;
  members: UserProfile[];
};

export type Organization = {
  id: string;
  name: string;
  description: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  reason_for_creation: string | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string;
  team?: TeamOut | null;
};

// GET /api/organizations - Get all organizations
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const token = session?.accessToken;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/organisation/all`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData?.message || "Failed to fetch organizations" },
        { status: res.status }
      );
    }
    const organizations: Organization[] = await res.json();
    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { message: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}

// POST /api/organizations - Create a new organization
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const session = await auth();
    const token = session?.accessToken;

    // Validate required fields
    if (
      !data.name ||
      !data.description ||
      !data.address ||
      !data.phone ||
      !data.email
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/organisation/new`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData?.message || "Failed to create organization" },
        { status: res.status }
      );
    }

    const newOrganization: Organization = await res.json();
    return NextResponse.json(newOrganization, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { message: "Failed to create organization" },
      { status: 500 }
    );
  }
}
