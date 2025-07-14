import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

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

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "seed.json");
    const fileContents = await fs.readFile(filePath, "utf-8");
    const rawUsers = JSON.parse(fileContents);

    if (!Array.isArray(rawUsers)) {
      return NextResponse.json({ message: "Invalid user data" }, { status: 500 });
    }

    const normalizedUsers: UserProfile[] = rawUsers.map((user: any, index: number) => ({
      id: user.id ?? `user-${index}`, // Generate fallback ID
      email: user.email ?? "",
      full_name: user.full_name ?? "",
      phone: user.phone ?? null,
      address: user.address ?? null,
      state: user.state ?? null,
      profession: user.profession ?? null,
      gender: user.gender ?? null,
      bio: user.bio ?? null,
      image: user.image ?? null,
      role: user.role ?? "user",
      status: user.status ?? "inactive",
      created_at: user.created_at ?? new Date().toISOString(),
      updated_at: user.updated_at ?? new Date().toISOString(),
      organization_id: user.organization_id ?? null,
    }));

    return NextResponse.json(normalizedUsers);
  } catch (error) {
    console.error("Failed to read or parse seed.json:", error);
    return NextResponse.json(
      { message: "Failed to load user data" },
      { status: 500 }
    );
  }
}
