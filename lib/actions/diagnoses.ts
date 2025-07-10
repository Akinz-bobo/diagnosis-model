"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { post, handleApiError } from "@/lib/api-utils";
import type { DiagnosisResult } from "@/lib/types";
import { auth } from "../auth";
import { NextResponse } from "next/server";

// Validation schemas
const diagnosisSchema = z.object({
  Species: z.string().min(1, { message: "Species is required" }),
  Age: z.string().min(1, { message: "Age is required" }),
  "Clinical Signs": z
    .string()
    .min(1, { message: "Clinical signs are required" }),
  "Post-Mortem Findings": z
    .string()
    .min(1, { message: "Post-mortem findings are required" }),
  "Total Birds in Farm": z.coerce
    .number()
    .min(1, { message: "Total birds must be at least 1" }),
  "Total Affected": z.coerce
    .number()
    .min(0, { message: "Total affected must be a positive number" }),
  "Total Deaths": z.coerce
    .number()
    .min(0, { message: "Total deaths must be a positive number" }),
});

export async function getDiagnoses(
  userId?: string
): Promise<DiagnosisResult[]> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error("User not authenticated");
    }

    // If you want to filter by userId, add it as a query param if your API supports it
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/diagnosis/me/all`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch diagnoses");
    }

    const result = await res.json();

    // console.log(result);

    // Ensure result is an array of DiagnosisResult
    if (!Array.isArray(result)) {
      throw new Error("Unexpected response format: diagnoses is not an array");
    }

    // Optionally filter by userId if needed (if API doesn't do it)
    const filtered = userId
      ? result.filter((d: DiagnosisResult) => d.user_id === userId)
      : result;

    return filtered;
  } catch (error: any) {
    console.error("Error fetching diagnoses:", error);
    // Always return an empty array on error to avoid breaking the UI
    return [];
  }
}
export async function getDiagnosis(
  id: string
): Promise<DiagnosisResult | null> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error("User not authenticated");
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/diagnosis/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Error fetching diagnosis ${id}:`, errorData);
      return null;
    }
    const diagnosis = await response.json();
    return diagnosis as DiagnosisResult;
  } catch (error) {
    console.error(`Error fetching diagnosis ${id}:`, error);
    return null;
  }
}

export async function createDiagnosis(formData: FormData) {
  try {
    // Extract and validate form data
    const validatedFields = diagnosisSchema.safeParse({
      Species: formData.get("Species"),
      Age: formData.get("Age"),
      "Clinical Signs": formData.get("Clinical Signs"),
      "Post-Mortem Findings": formData.get("Post-Mortem Findings"),
      "Total Birds in Farm": formData.get("Total Birds in Farm"),
      "Total Affected": formData.get("Total Affected"),
      "Total Deaths": formData.get("Total Deaths"),
    });

    if (!validatedFields.success) {
      return { error: "Invalid form data" };
    }

    // Get images
    const images = formData.getAll("images") as File[];
    if (images.length === 0) {
      return { error: "At least one image is required" };
    }

    // In a real app, upload images and send data to API
    // For now, just create a mock diagnosis
    const newDiagnosis = await post("/diagnoses", validatedFields.data);

    revalidatePath("/dashboard/diagnoses");
    return { success: true, diagnosis: newDiagnosis };
  } catch (error) {
    console.error("Error creating diagnosis:", error);
    return { error: handleApiError(error) };
  }
}

export async function getAllDiagnosesAdmin(): Promise<DiagnosisResult[]> {
  try {
    const session = await auth();
    if (!session?.accessToken) {
      throw new Error("User not authenticated");
    }
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/diagnosis/all`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to fetch all diagnoses");
    }
    const result = await res.json();
    if (!Array.isArray(result)) {
      throw new Error("Unexpected response format: diagnoses is not an array");
    }
    return result;
  } catch (error: any) {
    console.error("Error fetching all diagnoses (admin):", error);
    return [];
  }
}
