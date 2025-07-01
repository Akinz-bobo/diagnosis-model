import type { NextRequest } from "next/server";
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await auth();
    const userId = params.userId;
    const formData = await request.formData();

    // Forward the PATCH request to the backend API
    const base = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
    const backendRes = await fetch(`${base}/api/v1/users/${userId}`, {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
      // If you need to forward authentication, add headers here
      // headers: { Authorization: `Bearer ${token}` },
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}));
      return new Response(
        JSON.stringify({
          message: errorData?.message || "Failed to update user",
        }),
        { status: backendRes.status }
      );
    }

    const updatedUser: UserProfile = await backendRes.json();
    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ message: "Failed to update user" }), {
      status: 500,
    });
  }
}
