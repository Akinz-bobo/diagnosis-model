import { NextResponse } from "next/server";
import type { Subscription } from "@/lib/types";
export async function getSubscriptionById(
  id: string
): Promise<Subscription | null> {
  try {
    const response = await fetch(`/api/subscriptions/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch subscription");
    }
    const data = await response.json();
    return data as Subscription;
  } catch (error) {
    console.error("Error fetching subscription by ID:", error);
    return null;
  }
}
