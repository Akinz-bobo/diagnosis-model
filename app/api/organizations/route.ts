import { type NextRequest, NextResponse } from "next/server";
import type { Organization } from "@/lib/types";

// Mock data store
const organizations: Organization[] = [
  {
    id: "1",
    name: "Vet Clinic A",
    description: "A leading veterinary clinic specializing in poultry health.",
    address: "123 Main St, Anytown, USA",
    phone: "+1 (555) 123-4567",
    email: "contact@vetclinica.com",
    website: "https://vetclinica.com",
    members: [
      {
        id: "1",
        name: "John Doe",
        email: "john@vetclinica.com",
        role: "Admin",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@vetclinica.com",
        role: "Member",
      },
    ],
  },
  {
    id: "2",
    name: "Vet Clinic B",
    description: "Specialized in exotic bird treatments and diagnostics.",
    address: "456 Oak St, Somewhere, USA",
    phone: "+1 (555) 987-6543",
    email: "contact@vetclinicb.com",
    website: "https://vetclinicb.com",
    members: [
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob@vetclinicb.com",
        role: "Admin",
      },
    ],
  },
];

// GET /api/organizations - Get all organizations or a specific one
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    // If id is provided, return a specific organization
    if (id) {
      const organization = organizations.find((org) => org.id === id);

      if (!organization) {
        return NextResponse.json(
          { message: "Organization not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(organization);
    }

    // If userId is provided, return organizations where the user is a member
    if (userId) {
      const userOrgs = organizations.filter((org) =>
        org.members.some((member) => member.id === userId)
      );

      return NextResponse.json(userOrgs);
    }

    // Otherwise return all organizations
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

    // Create new organization
    const newOrganization: Organization = {
      id: `org-${Date.now()}`,
      name: data.name,
      description: data.description,
      address: data.address,
      phone: data.phone,
      email: data.email,
      website: data.website,
      members: data.members || [],
    };

    organizations.push(newOrganization);

    return NextResponse.json(newOrganization, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { message: "Failed to create organization" },
      { status: 500 }
    );
  }
}

// PUT /api/organizations - Update an organization
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.id) {
      return NextResponse.json(
        { message: "Organization ID is required" },
        { status: 400 }
      );
    }

    // Find organization
    const orgIndex = organizations.findIndex((org) => org.id === data.id);

    if (orgIndex === -1) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // Update organization
    const updatedOrg = {
      ...organizations[orgIndex],
      ...data,
    };

    organizations[orgIndex] = updatedOrg;

    return NextResponse.json(updatedOrg);
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { message: "Failed to update organization" },
      { status: 500 }
    );
  }
}

// DELETE /api/organizations - Delete an organization
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Organization ID is required" },
        { status: 400 }
      );
    }

    const initialLength = organizations.length;
    const newOrgs = organizations.filter((org) => org.id !== id);

    if (newOrgs.length === initialLength) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // Update the organizations array
    organizations.length = 0;
    organizations.push(...newOrgs);

    return NextResponse.json({ message: "Organization deleted successfully" });
  } catch (error) {
    console.error("Error deleting organization:", error);
    return NextResponse.json(
      { message: "Failed to delete organization" },
      { status: 500 }
    );
  }
}
