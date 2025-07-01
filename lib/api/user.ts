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

export async function fetchCurrentUser(): Promise<UserProfile> {
  const res = await fetch("/api/users", { credentials: "include" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to fetch user");
  }
  return res.json();
}

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
