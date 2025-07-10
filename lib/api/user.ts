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
  twoFactorEnabled?: boolean;
  appearancePreferences?: {
    theme: "light" | "dark" | "system";
  };
  notificationPreferences?: {
    marketingEmails?: boolean;
    securityAlerts?: boolean;
    productUpdates?: boolean;
    apiUsageAlerts?: boolean;
    emailNotifications?: boolean;
  };
};

// Fetch current user (GET /api/users/me)
export async function fetchCurrentUser(): Promise<UserProfile> {
  const res = await fetch("/api/users/me", { credentials: "include" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to fetch user");
  }
  return res.json();
}

// Fetch all users (admin only)
export async function fetchAllUsers(): Promise<UserProfile[]> {
  const res = await fetch("/api/users", { credentials: "include" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to fetch users");
  }
  return res.json();
}

// Fetch user by ID
export async function fetchUserById(userId: string): Promise<UserProfile> {
  const res = await fetch(`/api/users/${userId}`, { credentials: "include" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to fetch user");
  }
  return res.json();
}

// Fetch users by organization
export async function fetchUsersByOrganization(
  orgId: string
): Promise<UserProfile[]> {
  const res = await fetch(`/api/users/organization/${orgId}`, {
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to fetch users by organization");
  }
  return res.json();
}

// Update user (PATCH /api/users/:userId)
export async function updateUser(
  userId: string,
  data: Partial<UserProfile> & { image_file?: File }
): Promise<UserProfile> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });
  const res = await fetch(`/api/users/${userId}`, {
    method: "PATCH",
    body: formData,
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to update user");
  }
  return res.json();
}

// Suspend user (POST /api/users/:userId/suspend)
export async function suspendUser(userId: string): Promise<UserProfile> {
  const res = await fetch(`/api/users/${userId}/suspend`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to suspend user");
  }
  return res.json();
}

// Promote user to admin (POST /api/users/:userId/promote)
export async function promoteUserToAdmin(userId: string): Promise<UserProfile> {
  const res = await fetch(`/api/users/${userId}/promote`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to promote user");
  }
  return res.json();
}
