import { type NextRequest, NextResponse } from "next/server";
import type { User } from "@/lib/types";
import { users } from "@/lib/database/usersDB";
// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    // In a real app, you would add authentication and authorization checks here

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // If id is provided, return a specific user
    if (id) {
      const user = users.find((user) => user.id === id);

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(user);
    }

    // Otherwise return all users
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.email || !data.full_name) {
      return NextResponse.json(
        { message: "Email and full name are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    if (users.some((user) => user.email === data.email)) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      image: data.image || "https://placeholder.com/150",
      full_name: data.full_name,
      role: data.role || "user",
      emailVerified: data.emailVerified || false,
    };

    users.push(newUser);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update a user
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Find user
    const userIndex = users.findIndex((user) => user.id === data.id);

    if (userIndex === -1) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update user
    const updatedUser = {
      ...users[userIndex],
      ...data,
    };

    users[userIndex] = updatedUser;

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users - Delete a user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const initialLength = users.length;
    const newUsers = users.filter((user) => user.id !== id);

    if (newUsers.length === initialLength) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Update the users array
    users.length = 0;
    users.push(...newUsers);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
