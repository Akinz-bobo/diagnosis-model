import { UserProfile } from "@/lib/api/user";

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

// Fetch all API keys
export async function fetchApiKeys(): Promise<APIKeyOutFull[]> {
  const res = await fetch("/api/api-keys", { credentials: "include" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to fetch API keys");
  }
  return res.json();
}

// Create a new API key
export async function createApiKey(
  data: APIKeyCreate
): Promise<APIKeyOutFull> {
  const res = await fetch("/api/api-keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to create API key");
  }
  return res.json();
}

// Get API key by ID
export async function fetchApiKeyById(apiKeyId: string): Promise<APIKeyOutFull> {
  const res = await fetch(`/api/api-keys/${apiKeyId}`, { credentials: "include" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to fetch API key");
  }
  return res.json();
}

// Update API key by ID
export async function updateApiKey(
  apiKeyId: string,
  data: Partial<APIKeyBase>
): Promise<APIKeyOutFull> {
  const res = await fetch(`/api/api-keys/${apiKeyId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to update API key");
  }
  return res.json();
}
