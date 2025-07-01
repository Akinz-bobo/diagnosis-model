import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    console.log(data);
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

    const newOrganization = await res.json();
    console.log("New ORG: ", newOrganization);
    return NextResponse.json(newOrganization, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { message: "Failed to create organization" },
      { status: 500 }
    );
  }
}
