"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { DiagnosisResult } from "@/lib/types";

// Mock data store
const diagnoses: DiagnosisResult[] = [
  {
    id: "1",
    disease: "Avian Influenza",
    confidence: 0.92,
    date: "2 hours ago",
    species: "Chicken",
    background:
      "Avian influenza, commonly known as bird flu, is a highly contagious viral infection that affects birds. The disease is caused by influenza A viruses. These viruses can infect domestic poultry, including chickens, ducks, and turkeys, as well as wild birds. The symptoms include respiratory distress, decreased egg production, swollen head, and high mortality rates.",
  },
  {
    id: "2",
    disease: "Newcastle Disease",
    confidence: 0.87,
    date: "Yesterday",
    species: "Chicken",
    background:
      "Newcastle disease is a highly contagious viral disease affecting many species of birds, including domestic poultry. It is caused by avian paramyxovirus type 1 (APMV-1). The disease can cause severe respiratory, neurological, and digestive symptoms, and can lead to high mortality rates in affected flocks.",
  },
  {
    id: "3",
    disease: "Fowl Cholera",
    confidence: 0.78,
    date: "3 days ago",
    species: "Duck",
    background:
      "Fowl cholera is a contagious bacterial disease that affects domestic and wild birds. It is caused by the bacterium Pasteurella multocida. The disease can be acute or chronic, with symptoms including respiratory distress, diarrhea, and sudden death in acute cases.",
  },
  {
    id: "4",
    disease: "Infectious Bronchitis",
    confidence: 0.95,
    date: "1 week ago",
    species: "Chicken",
    background:
      "Infectious bronchitis is a highly contagious respiratory disease of chickens caused by infectious bronchitis virus (IBV), a coronavirus. The disease affects the respiratory tract, kidneys, and reproductive system of chickens, leading to reduced egg production and quality in laying hens.",
  },
];

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

// Actions
export async function getDiagnoses(
  userId?: string
): Promise<DiagnosisResult[]> {
  // In a real app, filter by userId
  return diagnoses;
}

export async function getDiagnosis(
  id: string
): Promise<DiagnosisResult | null> {
  return diagnoses.find((diagnosis) => diagnosis.id === id) || null;
}

export async function createDiagnosis(formData: FormData) {
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

  // In a real app, process images and send to AI model

  // Create a mock diagnosis result
  const diseases = [
    "Avian Influenza",
    "Newcastle Disease",
    "Fowl Cholera",
    "Infectious Bronchitis",
    "Marek's Disease",
  ];
  const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
  const confidence = 0.7 + Math.random() * 0.3; // Random confidence between 0.7 and 1.0

  const newDiagnosis: DiagnosisResult = {
    id: `diag-${Date.now()}`,
    disease: randomDisease,
    confidence,
    date: "Just now",
    species: validatedFields.data.Species,
    background:
      "Detailed background information about the disease would be provided by the AI model.",
  };

  // Add to diagnoses
  diagnoses.unshift(newDiagnosis);
  revalidatePath("/dashboard/diagnoses");

  return { success: true, diagnosis: newDiagnosis };
}
