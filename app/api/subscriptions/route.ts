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

export type SubscriptionCreate = {
  plan_name: string;
  user_id: string;
};

// GET /api/subscriptions - Get all subscriptions
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const token = session?.accessToken;
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/subscription/all`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData?.message || "Failed to fetch subscriptions" },
        { status: res.status }
      );
    }
    const subscriptions: Subscription[] = await res.json();
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { message: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions - Create a new subscription
export async function POST(request: NextRequest) {
  try {
    const data: SubscriptionCreate = await request.json();
    const session = await auth();
    const token = session?.accessToken;

    if (!data.plan_name || !data.user_id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/subscription/new`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData?.message || "Failed to create subscription" },
        { status: res.status }
      );
    }

    const newSubscription: Subscription = await res.json();
    return NextResponse.json(newSubscription, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { message: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
