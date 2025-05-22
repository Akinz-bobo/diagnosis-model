"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { get, post, put, del, handleApiError } from "@/lib/api-utils";
import type { User } from "@/lib/types";

// Validation schemas
const signupSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  full_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

const signinSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const userUpdateSchema = z.object({
  id: z.string(),
  full_name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .optional(),
  role: z.enum(["user", "admin"]).optional(),
  emailVerified: z.boolean().optional(),
});

const profileUpdateSchema = z.object({
  userId: z.string(),
  name: z.string().min(2).max(30),
  email: z.string().email(),
  bio: z.string().max(160).optional(),
  avatarUrl: z.string().optional(),
});

const passwordUpdateSchema = z.object({
  userId: z.string(),
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
});

const notificationsUpdateSchema = z.object({
  userId: z.string(),
  notificationPreferences: z.object({
    emailNotifications: z.boolean(),
    marketingEmails: z.boolean(),
    securityAlerts: z.boolean(),
    productUpdates: z.boolean(),
    apiUsageAlerts: z.boolean(),
  }),
});

const appearanceUpdateSchema = z.object({
  userId: z.string(),
  appearancePreferences: z.object({
    theme: z.enum(["light", "dark", "system"]),
  }),
});

const enable2FASchema = z.object({
  userId: z.string(),
  enabled: z.boolean(),
});

// Actions
export async function getUsers(): Promise<User[]> {
  try {
    return await get<User[]>("/users");
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(handleApiError(error));
  }
}

export async function getUser(id: string): Promise<User | null> {
  try {
    return await get<User>(`/users?id=${id}`);
  } catch (error) {
    console.error(`Error fetching user ${id}:`, error);
    return null;
  }
}

export async function signup(formData: FormData) {
  try {
    const validatedFields = signupSchema.safeParse({
      email: formData.get("email"),
      full_name: formData.get("full_name"),
      phone: formData.get("phone"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }

    const { email, full_name, phone, password } = validatedFields.data;

    const response = await post("/users", {
      email,
      full_name,
      phone,
      password,
    });

    return { success: true };
  } catch (error) {
    console.error("Error signing up:", error);
    return { error: handleApiError(error) };
  }
}

export async function signin(formData: FormData) {
  try {
    const validatedFields = signinSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }

    const { email, password } = validatedFields.data;

    // In a real app, this would call an authentication API endpoint
    // For now, simulate a successful login for demo purposes
    if (email === "admin@example.com" || email === "user@example.com") {
      return { success: true, redirectTo: "/dashboard" };
    }

    return { error: "Invalid email or password" };
  } catch (error) {
    console.error("Error signing in:", error);
    return { error: handleApiError(error) };
  }
}

export async function signout() {
  // In a real app, this would call an API to invalidate the session
  // For now, just redirect to the signin page
  return { success: true, redirectTo: "/signin" };
}

export async function forgotPassword(formData: FormData) {
  try {
    const validatedFields = forgotPasswordSchema.safeParse({
      email: formData.get("email"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid email address" };
    }

    // In a real app, this would call an API to send a reset email
    return { success: true };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return { error: handleApiError(error) };
  }
}

export async function resetPassword(formData: FormData) {
  try {
    const validatedFields = resetPasswordSchema.safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      token: formData.get("token"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }

    // In a real app, this would call an API to reset the password
    return { success: true };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { error: handleApiError(error) };
  }
}

export async function updateUser(formData: FormData) {
  try {
    const validatedFields = userUpdateSchema.safeParse({
      id: formData.get("id"),
      full_name: formData.get("full_name"),
      role: formData.get("role"),
      emailVerified: formData.get("emailVerified") === "true",
    });

    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }

    const updatedUser = await put("/users", validatedFields.data);
    console.log("Updated user:", updatedUser);

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: handleApiError(error) };
  }
}

export async function deleteUser(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      return { error: "User ID is required" };
    }

    await del(`/users?id=${id}`);

    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: handleApiError(error) };
  }
}

export async function updateUserProfile(
  data: z.infer<typeof profileUpdateSchema>
) {
  try {
    const validatedFields = profileUpdateSchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: handleApiError(error) };
  }
}

export async function updateUserPassword(
  data: z.infer<typeof passwordUpdateSchema>
) {
  try {
    const validatedFields = passwordUpdateSchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    return { error: handleApiError(error) };
  }
}

export async function updateUserNotifications(
  data: z.infer<typeof notificationsUpdateSchema>
) {
  try {
    const validatedFields = notificationsUpdateSchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error("Error updating notifications:", error);
    return { error: handleApiError(error) };
  }
}

export async function updateUserAppearance(
  data: z.infer<typeof appearanceUpdateSchema>
) {
  try {
    const validatedFields = appearanceUpdateSchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error("Error updating appearance:", error);
    return { error: handleApiError(error) };
  }
}

export async function enable2FA(data: z.infer<typeof enable2FASchema>) {
  try {
    const validatedFields = enable2FASchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    return { error: handleApiError(error) };
  }
}
export async function disable2FA(data: z.infer<typeof enable2FASchema>) {
  try {
    const validatedFields = enable2FASchema.safeParse(data);

    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }

    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 500));

    return { success: true };
  } catch (error) {
    console.error("Error disabling 2FA:", error);
    return { error: handleApiError(error) };
  }
}
export async function getUserAnalytics() {
  try {
    return await get("/analytics?type=user");
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserSubscriptionAnalytics() {
  try {
    return await get("/analytics?type=user-subscription");
  } catch (error) {
    console.error("Error fetching user subscription analytics:", error);
    throw new Error(handleApiError(error));
  }
}

export async function getUserApiAnalytics() {
  try {
    return await get("/analytics?type=user-api");
  } catch (error) {
    console.error("Error fetching user API analytics:", error);
    throw new Error(handleApiError(error));
  }
}
