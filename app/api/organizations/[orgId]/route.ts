import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export type TeamOut = {
  id: string;
  name: string;
  organization_id: string;
  members: any[];
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

// GET /api/organizations/[orgId] - Get organization by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { orgId: string } }
): Promise<NextResponse<Organization | { message: string }>> {
  try {
    const session = await auth();
    const token = session?.accessToken;
    const orgId = params.orgId;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/organisation/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData?.message || "Failed to fetch organization" },
        { status: res.status }
      );
    }
    const organization: Organization = await res.json();
    return NextResponse.json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json(
      { message: "Failed to fetch organization" },
      { status: 500 }
    );
  }
}

// PATCH /api/organizations/[orgId] - Update organization by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { orgId: string } }
): Promise<NextResponse<Organization | { message: string }>> {
  try {
    const session = await auth();
    const token = session?.accessToken;
    const orgId = params.orgId;
    const data = await request.json();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/organisation/${orgId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData?.message || "Failed to update organization" },
        { status: res.status }
      );
    }
    const updatedOrg: Organization = await res.json();
    return NextResponse.json(updatedOrg);
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { message: "Failed to update organization" },
      { status: 500 }
    );
  }
}
