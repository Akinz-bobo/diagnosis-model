import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// TypeScript types matching backend schema
export type APIKeyBase = {
  user_id: string;
  organization_id: string;
  purpose?: string | null;
  name?: string | null;
  type?: string | null; // 'test' or 'production'
};

export type APIKeyCreate = APIKeyBase;

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

// GET /api/api-keys - Get all API keys
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const token = session?.accessToken;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/api-key/admin/all`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData?.message || "Failed to fetch API keys" },
        { status: res.status }
      );
    }
    const apiKeys: APIKeyOutFull[] = await res.json();
    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json(
      { message: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

// POST /api/api-keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const session = await auth();
    const token = session?.accessToken;

    // Validate required fields
    if (!data.user_id || !data.organization_id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/api-key/new`,
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
        { message: errorData?.message || "Failed to create API key" },
        { status: res.status }
      );
    }

    const newApiKey: APIKeyOutFull = await res.json();
    return NextResponse.json(newApiKey, { status: 201 });
  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json(
      { message: "Failed to create API key" },
      { status: 500 }
    );
  }
}
