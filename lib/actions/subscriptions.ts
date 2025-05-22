"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { get, post, put, handleApiError } from "@/lib/api-utils";

// Validation schemas
const upgradeSubscriptionSchema = z.object({
  userId: z.string(),
  plan: z.enum(["free", "pro", "enterprise"]),
  paymentMethodId: z.string().optional(),
});

// Actions
export async function getSubscription(userId: string) {
  try {
    return await get(`/subscriptions?userId=${userId}`);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

export async function upgradeSubscription(formData: FormData) {
  try {
    const validatedFields = upgradeSubscriptionSchema.safeParse({
      userId: formData.get("userId"),
      plan: formData.get("plan"),
      paymentMethodId: formData.get("paymentMethodId"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }

    await post("/subscriptions", validatedFields.data);

    revalidatePath("/dashboard/subscription");
    return { success: true };
  } catch (error) {
    console.error("Error upgrading subscription:", error);
    return { error: handleApiError(error) };
  }
}

export async function cancelSubscription(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;

    if (!userId) {
      return { error: "User ID is required" };
    }

    await put("/subscriptions", { userId, action: "cancel" });

    revalidatePath("/dashboard/subscription");
    return { success: true };
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return { error: handleApiError(error) };
  }
}

export async function reactivateSubscription(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;

    if (!userId) {
      return { error: "User ID is required" };
    }

    await put("/subscriptions", { userId, action: "reactivate" });

    revalidatePath("/dashboard/subscription");
    return { success: true };
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return { error: handleApiError(error) };
  }
}

export async function addPaymentMethod(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;
    const paymentMethodId = formData.get("paymentMethodId") as string;

    if (!userId || !paymentMethodId) {
      return { error: "Missing required data" };
    }

    // In a real app, save payment method to payment processor
    // For now, just update the subscription
    await post("/subscriptions", { userId, paymentMethodId });

    revalidatePath("/dashboard/subscription");
    return { success: true };
  } catch (error) {
    console.error("Error adding payment method:", error);
    return { error: handleApiError(error) };
  }
}
export async function removePaymentMethod(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;

    if (!userId) {
      return { error: "User ID is required" };
    }

    // In a real app, remove payment method from payment processor
    // For now, just update the subscription
    await put("/subscriptions", { userId, action: "removePaymentMethod" });

    revalidatePath("/dashboard/subscription");
    return { success: true };
  } catch (error) {
    console.error("Error removing payment method:", error);
    return { error: handleApiError(error) };
  }
}

export async function getSubscriptionHistory(userId: string) {
  try {
    return await get(`/subscriptions/history?userId=${userId}`);
  } catch (error) {
    console.error("Error fetching subscription history:", error);
    return null;
  }
}

export async function getSubscriptionUsage(userId: string) {
  try {
    return await get(`/subscriptions/usage?userId=${userId}`);
  } catch (error) {
    console.error("Error fetching subscription usage:", error);
    return null;
  }
}
