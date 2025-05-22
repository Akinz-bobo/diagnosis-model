"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Organization, OrganizationMember } from "@/lib/types";

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
];

// Validation schemas
const organizationSchema = z.object({
  name: z.string().min(3, {
    message: "Organization name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  phone: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  reason: z.string().min(20, {
    message: "Please provide a detailed reason for your request.",
  }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
});

const memberInviteSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  role: z.string(),
  organizationId: z.string(),
});

// Actions
export async function getOrganization(
  userId: string
): Promise<Organization | null> {
  // In a real app, find organization by userId
  // For demo, return the first organization
  return organizations[0] || null;
}

export async function registerOrganization(formData: FormData) {
  const validatedFields = organizationSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    address: formData.get("address"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    website: formData.get("website"),
    reason: formData.get("reason"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid form data" };
  }

  const { name, description, address, phone, email, website, reason } =
    validatedFields.data;

  // Create a new organization
  const newOrganization: Organization = {
    id: `org-${Date.now()}`,
    name,
    description,
    address,
    phone,
    email,
    website: website || undefined,
    reason,
    members: [
      {
        id: "current-user",
        name: "Current User", // In a real app, get from session
        email: "user@example.com", // In a real app, get from session
        role: "Admin",
      },
    ],
  };

  organizations.push(newOrganization);
  revalidatePath("/dashboard/organization");

  return { success: true };
}

export async function inviteMember(formData: FormData) {
  const validatedFields = memberInviteSchema.safeParse({
    email: formData.get("email"),
    role: formData.get("role"),
    organizationId: formData.get("organizationId"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid form data" };
  }

  const { email, role, organizationId } = validatedFields.data;

  // Find the organization
  const organization = organizations.find((org) => org.id === organizationId);
  if (!organization) {
    return { error: "Organization not found" };
  }

  // Create a new member
  const newMember: OrganizationMember = {
    id: `member-${Date.now()}`,
    name: email.split("@")[0], // Use part of email as name
    email,
    role,
  };

  // Add to organization
  organization.members.push(newMember);
  revalidatePath("/dashboard/organization");

  return { success: true };
}

export async function leaveOrganization(formData: FormData) {
  const organizationId = formData.get("organizationId") as string;
  const userId = formData.get("userId") as string;

  if (!organizationId || !userId) {
    return { error: "Missing required data" };
  }

  // Find the organization
  const organization = organizations.find((org) => org.id === organizationId);
  if (!organization) {
    return { error: "Organization not found" };
  }

  // Remove the member
  organization.members = organization.members.filter(
    (member) => member.id !== userId
  );
  revalidatePath("/dashboard/organization");

  return { success: true };
}
