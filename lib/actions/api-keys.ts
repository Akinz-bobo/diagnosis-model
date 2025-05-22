"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { get, post, put, handleApiError } from "@/lib/api-utils";
import type { ApiKey } from "@/lib/types";

// Validation schemas
const apiKeyRequestSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  environment: z.string({
    required_error: "Please select an environment.",
  }),
  purpose: z.string().min(10, {
    message: "Purpose must be at least 10 characters.",
  }),
  organization: z.string().optional(),
  user: z.string(),
});

const apiKeyActionSchema = z.object({
  id: z.string(),
  action: z.enum(["approve", "reject", "suspend", "reactivate", "delete"]),
});

// Actions
export async function getApiKeys(userId?: string): Promise<ApiKey[]> {
  try {
    if (userId) {
      return await get<ApiKey[]>(`/api-keys?userId=${userId}`);
    }
    return await get<ApiKey[]>("/api-keys");
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return [];
  }
}

export async function getPendingApiKeyRequests(): Promise<ApiKey[]> {
  try {
    return await get<ApiKey[]>("/api-keys?pending=true");
  } catch (error) {
    console.error("Error fetching pending API key requests:", error);
    return [];
  }
}

export async function requestApiKey(formData: FormData) {
  try {
    const validatedFields = apiKeyRequestSchema.safeParse({
      name: formData.get("name"),
      environment: formData.get("environment"),
      purpose: formData.get("purpose"),
      organization: formData.get("organization"),
      user: formData.get("user") || "Current User",
    });

    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }

    await post("/api-keys", validatedFields.data);

    revalidatePath("/dashboard/api-keys");
    return { success: true };
  } catch (error) {
    console.error("Error requesting API key:", error);
    return { error: handleApiError(error) };
  }
}

export async function performApiKeyAction(formData: FormData) {
  try {
    const validatedFields = apiKeyActionSchema.safeParse({
      id: formData.get("id"),
      action: formData.get("action"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid action data" };
    }

    const { id, action } = validatedFields.data;

    await put("/api-keys", { id, action });

    revalidatePath("/dashboard/api-keys");
    return { success: true };
  } catch (error) {
    console.error("Error performing API key action:", error);
    return { error: handleApiError(error) };
  }
}

export async function deleteApiKey(id: string) {
  try {
    await post(`/api-keys/${id}/delete`, { id });
    revalidatePath("/dashboard/api-keys");
  } catch (error) {
    console.error("Error deleting API key:", error);
  }
}

export async function suspendApiKey(id: string) {
  try {
    await post(`/api-keys/${id}/suspend`, { id });
    revalidatePath("/dashboard/api-keys");
  } catch (error) {
    console.error("Error suspending API key:", error);
  }
}
export async function reactivateApiKey(id: string) {
  try {
    await post(`/api-keys/${id}/reactivate`, { id });
    revalidatePath("/dashboard/api-keys");
  } catch (error) {
    console.error("Error reactivating API key:", error);
  }
}
export async function approveApiKey(id: string) {
  try {
    await post(`/api-keys/${id}/approve`, { id });
    revalidatePath("/dashboard/api-keys");
  } catch (error) {
    console.error("Error approving API key:", error);
  }
}
export async function rejectApiKey(id: string) {
  try {
    await post(`/api-keys/${id}/reject`, { id });
    revalidatePath("/dashboard/api-keys");
  } catch (error) {
    console.error("Error rejecting API key:", error);
  }
}

export async function getApiKeyById(id: string): Promise<ApiKey | null> {
  try {
    const apiKeys = await get<ApiKey[]>(`/api-keys/${id}`);
    return apiKeys.length > 0 ? apiKeys[0] : null;
  } catch (error) {
    console.error("Error fetching API key by ID:", error);
    return null;
  }
}

export async function getApiKeyByUserId(userId: string): Promise<ApiKey[]> {
  try {
    return await get<ApiKey[]>(`/api-keys?userId=${userId}`);
  } catch (error) {
    console.error("Error fetching API key by user ID:", error);
    return [];
  }
}
export async function getApiKeyByOrganizationId(
  organizationId: string
): Promise<ApiKey[]> {
  try {
    return await get<ApiKey[]>(`/api-keys?organizationId=${organizationId}`);
  } catch (error) {
    console.error("Error fetching API key by organization ID:", error);
    return [];
  }
}

export async function getApiKeyByOrganizationIdAndUserId(
  organizationId: string,
  userId: string
): Promise<ApiKey[]> {
  try {
    return await get<ApiKey[]>(
      `/api-keys?organizationId=${organizationId}&userId=${userId}`
    );
  } catch (error) {
    console.error("Error fetching API key by organization and user ID:", error);
    return [];
  }
}
