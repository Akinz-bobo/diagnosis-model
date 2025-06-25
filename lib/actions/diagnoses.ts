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

// // Actions
// export async function getDiagnoses(
//   userId?: string
// ): Promise<DiagnosisResult[]> {
//   try {
//     // Mock data for demonstration - replace with actual API call
//     const mockDiagnoses: DiagnosisResult[] = [
//       {
//         id: "diag_001",
//         diagnosis: {
//           disease: "coccidiosis",
//           confidence: 0.9953913576930286,
//           differential_diagnoses: [
//             "Necrotic enteritis",
//             "Salmonellosis",
//             "Hemorrhagic enteritis",
//             "Clostridial enteritis",
//             "Histomoniasis (in poultry)",
//           ],
//         },
//         clinical_context: {
//           background:
//             "The clinical presentation strongly supports coccidiosis in these 3-week-old chickens. The observed intestinal hemorrhage, enlarged cecum, and intestinal congestion are hallmark lesions of coccidiosis, particularly caused by Eimeria tenella and other pathogenic Eimeria species.",
//           conclusion:
//             "Based on analysis of 3 valid image(s) showing 3 distinct lesions, the primary diagnosis is coccidiosis (confidence: 99.5%). Laboratory confirmation is recommended for definitive diagnosis.",
//           mortality_rate: 0.054285714285714284,
//           history_analysis: {
//             clinical_consistency_score: 0.8,
//             mortality_risk_score: 0.6,
//             species_issues: [
//               "Coccidiosis - highly consistent with bloody feces in young chickens",
//               "Necrotic enteritis - possible secondary bacterial infection",
//             ],
//             age_issues: [
//               "3-week chickens are particularly vulnerable to coccidiosis as maternal immunity wanes",
//               "Nutritional deficiencies may contribute to poor growth at this critical development stage",
//             ],
//             summary:
//               "The clinical presentation strongly suggests coccidiosis, a common protozoal disease in young chickens characterized by bloody feces and poor growth.",
//           },
//         },
//         image_analysis: {
//           processed_images: [
//             {
//               url: "/placeholder.svg?height=200&width=200",
//               lesions: ["Intestinal Congestion"],
//               confidences: [0.9164690375328064],
//               relevance: { "Intestinal Congestion": 1 },
//             },
//             {
//               url: "/placeholder.svg?height=200&width=200",
//               lesions: ["Enlarged Cecum"],
//               confidences: [0.7059271931648254],
//               relevance: { "Enlarged Cecum": 1 },
//             },
//             {
//               url: "/placeholder.svg?height=200&width=200",
//               lesions: ["Intestinal Hemorrhage"],
//               confidences: [0.48353004455566406],
//               relevance: { "Intestinal Hemorrhage": 1 },
//             },
//           ],
//           invalid_images: [],
//           total_lesions_identified: 3,
//         },
//         lesion_bedrock: {
//           lesion_relevance: {
//             "Intestinal Hemorrhage":
//               "In coccidiosis, intestinal hemorrhage occurs when Eimeria parasites invade and destroy intestinal epithelial cells, causing rupture of blood vessels.",
//             "Enlarged Cecum":
//               "The cecum becomes enlarged due to inflammation and thickening of the intestinal wall caused by the host's immune response to Eimeria infection.",
//             "Intestinal Congestion":
//               "Intestinal congestion results from the inflammatory response to Eimeria invasion, with increased blood flow to affected areas.",
//           },
//           differential_diagnoses: [
//             "Necrotic enteritis",
//             "Salmonellosis",
//             "Hemorrhagic enteritis",
//           ],
//           urgency: "Urgent",
//           urgency_reason:
//             "The presence of intestinal hemorrhage indicates active and potentially severe tissue damage that can lead to anemia, hypovolemia, and death if untreated.",
//         },
//         suggestions: [
//           "Consult a veterinarian for further evaluation",
//           "Consider laboratory confirmation for definitive diagnosis",
//           "Implement appropriate anticoccidial treatment immediately",
//           "Evaluate for secondary bacterial infections",
//         ],
//         warnings: null,
//         date: "2024-01-15T10:30:00Z",
//         species: "chicken",
//         user_id: userId || "user_001",
//       },
//       {
//         id: "diag_002",
//         diagnosis: {
//           disease: "newcastle disease",
//           confidence: 0.87,
//           differential_diagnoses: [
//             "Avian influenza",
//             "Infectious bronchitis",
//             "Fowl pox",
//           ],
//         },
//         clinical_context: {
//           background:
//             "Newcastle disease is a highly contagious viral infection affecting poultry worldwide.",
//           conclusion:
//             "Clinical signs and lesions are consistent with Newcastle disease. Immediate quarantine recommended.",
//           mortality_rate: 0.12,
//           history_analysis: {
//             clinical_consistency_score: 0.85,
//             mortality_risk_score: 0.9,
//             species_issues: ["High mortality in unvaccinated flocks"],
//             age_issues: ["Young birds more susceptible"],
//             summary:
//               "Highly contagious viral disease requiring immediate action.",
//           },
//         },
//         image_analysis: {
//           processed_images: [
//             {
//               url: "/placeholder.svg?height=200&width=200",
//               lesions: ["Respiratory distress", "Neurological signs"],
//               confidences: [0.85, 0.78],
//               relevance: {
//                 "Respiratory distress": 0.9,
//                 "Neurological signs": 0.8,
//               },
//             },
//           ],
//           invalid_images: [],
//           total_lesions_identified: 2,
//         },
//         lesion_bedrock: {
//           lesion_relevance: {
//             "Respiratory distress":
//               "Common early sign of Newcastle disease affecting the respiratory system.",
//             "Neurological signs":
//               "Advanced stage manifestation including head twisting and paralysis.",
//           },
//           differential_diagnoses: ["Avian influenza", "Infectious bronchitis"],
//           urgency: "Urgent",
//           urgency_reason:
//             "Highly contagious disease requiring immediate quarantine and reporting to authorities.",
//         },
//         suggestions: [
//           "Immediate quarantine of affected birds",
//           "Contact veterinary authorities",
//           "Implement biosecurity measures",
//         ],
//         warnings: "This is a reportable disease in many jurisdictions",
//         date: "2024-01-10T14:20:00Z",
//         species: "chicken",
//         user_id: userId || "user_001",
//       },
//     ];

//     if (userId) {
//       return mockDiagnoses.filter((d) => d.user_id === userId);
//     }
//     return mockDiagnoses;
//   } catch (error) {
//     console.error("Error fetching diagnoses:", error);
//     return [];
//   }
// }

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
    const diagnoses = await getDiagnoses();
    return diagnoses.find((d) => d.id === id) || null;
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
