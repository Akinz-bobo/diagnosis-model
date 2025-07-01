import { UserProfile } from "@/lib/api/user";

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

// Fetch all organizations
export async function fetchOrganizations(): Promise<Organization[]> {
  const res = await fetch("/api/organizations", { credentials: "include" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to fetch organizations");
  }
  return res.json();
}

// Create a new organization
export async function createOrganization(
  data: Omit<Organization, "id" | "created_at" | "updated_at" | "team">
): Promise<Organization> {
  const res = await fetch("/api/organizations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to create organization");
  }
  return res.json();
}

// Get organization by ID
export async function fetchOrganizationById(orgId: string): Promise<Organization> {
  const res = await fetch(`/api/organizations/${orgId}`, { credentials: "include" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to fetch organization");
  }
  return res.json();
}

// Update organization by ID
export async function updateOrganization(
  orgId: string,
  data: Partial<Omit<Organization, "id" | "created_at" | "updated_at" | "team">>
): Promise<Organization> {
  const res = await fetch(`/api/organizations/${orgId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to update organization");
  }
  return res.json();
}
