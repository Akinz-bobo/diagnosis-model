export enum SubscriptionStatus {
  active = "active",
  inactive = "inactive",
  cancelled = "cancelled",
}

export type SubscriptionFeatures = {
  team_allowed?: string;
  api_keys_allowed?: string;
  real_time_api_usage_tracking?: boolean;
  developer_support?: boolean;
  support_level?: string;
  unlimited_diagnosis?: boolean;
  unlimited_api_calls?: boolean;
  analytics_dashboard?: boolean;
  priority_queue?: boolean;
  [key: string]: any;
};

export type Subscription = {
  id: string;
  plan_name: string;
  user_id: string;
  organization_id?: string | null;
  features?: SubscriptionFeatures | null;
  status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
  allowed_calls: number;
  remaining_calls: number;
};

export type SubscriptionCreate = {
  plan_name: string;
  user_id: string;
};

export type SubscriptionUpdate = Partial<Pick<Subscription, "plan_name" | "status" | "allowed_calls" | "remaining_calls" | "features">>;

// Fetch all subscriptions
export async function fetchSubscriptions(): Promise<Subscription[]> {
  const res = await fetch("/api/subscriptions", { credentials: "include" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to fetch subscriptions");
  }
  return res.json();
}

// Create a new subscription
export async function createSubscription(
  data: SubscriptionCreate
): Promise<Subscription> {
  const res = await fetch("/api/subscriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to create subscription");
  }
  return res.json();
}

// Get subscription by ID
export async function fetchSubscriptionById(subscriptionId: string): Promise<Subscription> {
  const res = await fetch(`/api/subscriptions/${subscriptionId}`, { credentials: "include" });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to fetch subscription");
  }
  return res.json();
}

// Update subscription by ID
export async function updateSubscription(
  subscriptionId: string,
  data: SubscriptionUpdate
): Promise<Subscription> {
  const res = await fetch(`/api/subscriptions/${subscriptionId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Failed to update subscription");
  }
  return res.json();
}
