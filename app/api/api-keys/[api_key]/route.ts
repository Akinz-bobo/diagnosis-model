import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export type APIKeyBase = {
  user_id: string;
  organization_id: string;
  purpose?: string | null;
  name?: string | null;
  type?: string | null;
};

export type APIKeyOut = APIKeyBase & {
  id: string;
  created_at: string;
  updated_at: string;
};

export type APIKeyOutFull = {
  id: string;
  name?: string | null;
  key: string;
  status: string;
  created: string;
  lastUsed?: string | null;
  usageCount: number;
  user?: string | null;
  organization?: string | null;
};

// GET /api/api-keys/[api_key] - Get API key by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { api_key: string } }
): Promise<NextResponse<APIKeyOutFull | { message: string }>> {
  try {
    const session = await auth();
    const token = session?.accessToken;
    const apiKeyId = params.api_key;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/api-key/${apiKeyId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData?.message || "Failed to fetch API key" },
        { status: res.status }
      );
    }
    const apiKey: APIKeyOutFull = await res.json();
    return NextResponse.json(apiKey);
  } catch (error) {
    console.error("Error fetching API key:", error);
    return NextResponse.json(
      { message: "Failed to fetch API key" },
      { status: 500 }
    );
  }
}

// PATCH /api/api-keys/[api_key] - Update API key by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { api_key: string } }
): Promise<NextResponse<APIKeyOutFull | { message: string }>> {
  try {
    const session = await auth();
    const token = session?.accessToken;
    const apiKeyId = params.api_key;
    const data = await request.json();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/api-key/${apiKeyId}`,
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
        { message: errorData?.message || "Failed to update API key" },
        { status: res.status }
      );
    }
    const updatedApiKey: APIKeyOutFull = await res.json();
    return NextResponse.json(updatedApiKey);
  } catch (error) {
    console.error("Error updating API key:", error);
    return NextResponse.json(
      { message: "Failed to update API key" },
      { status: 500 }
    );
  }
}
