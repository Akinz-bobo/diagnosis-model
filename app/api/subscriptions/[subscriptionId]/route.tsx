import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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

export type SubscriptionUpdate = Partial<
  Pick<
    Subscription,
    "plan_name" | "status" | "allowed_calls" | "remaining_calls" | "features"
  >
>;

// GET /api/subscriptions/[subscriptionId] - Get subscription by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } }
): Promise<NextResponse<Subscription | { message: string }>> {
  try {
    const session = await auth();
    const token = session?.accessToken;
    const subscriptionId = params.subscriptionId;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/subscription/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData?.message || "Failed to fetch subscription" },
        { status: res.status }
      );
    }
    const subscription: Subscription = await res.json();
    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { message: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

// PATCH /api/subscriptions/[subscriptionId] - Update subscription by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { subscriptionId: string } }
): Promise<NextResponse<Subscription | { message: string }>> {
  try {
    const session = await auth();
    const token = session?.accessToken;
    const subscriptionId = params.subscriptionId;
    const data: SubscriptionUpdate = await request.json();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/subscription/${subscriptionId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData?.message || "Failed to update subscription" },
        { status: res.status }
      );
    }
    const updatedSubscription: Subscription = await res.json();
    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { message: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
