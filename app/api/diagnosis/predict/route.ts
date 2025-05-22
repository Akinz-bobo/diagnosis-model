// app/api/diagnosis/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Define expected form data fields
const REQUIRED_FIELDS = [
  "Species",
  "Age",
  "Clinical Signs",
  "Post-Mortem Findings",
  "Total Birds in Farm",
  "Total Affected",
  "Total Deaths",
];

export async function POST(req: Request) {
  try {
    // Authentication check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const tokenType = cookieStore.get("token_type")?.value || "Bearer";

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token found" },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await req.formData();

    // Extract history fields from formData (if sent from client as individual fields)
    // If client already sends 'history', use it directly
    let historyObj: Record<string, any> = {};
    if (formData.has("history")) {
      try {
        historyObj = JSON.parse(formData.get("history") as string);
      } catch {
        return NextResponse.json(
          { message: "Invalid history JSON" },
          { status: 400 }
        );
      }
    } else {
      // Fallback: build history from individual fields (for compatibility)
      historyObj = {
        Species: formData.get("Species"),
        Age: formData.get("Age"),
        "Clinical Signs": formData.get("Clinical Signs"),
        "Post-Mortem Findings": formData.get("Post-Mortem Findings"),
        "Total Birds in Farm": formData.get("Total Birds in Farm"),
        "Total Affected": formData.get("Total Affected"),
        "Total Deaths": formData.get("Total Deaths"),
      };
    }

    // Validate history fields (basic check)
    const validationErrors: Record<string, string> = {};
    for (const field of REQUIRED_FIELDS) {
      if (!historyObj[field]) {
        validationErrors[field] = `${field} is required`;
      }
    }
    // Age: must be in format "<number> <unit>" and unit is weeks/months/years
    const age = (historyObj["Age"] || "").toString().trim();
    if (!/^\d+\s*(weeks|months|years)$/.test(age)) {
      validationErrors["Age"] =
        "Age must be in format '<number> weeks|months|years'";
    }
    // Clinical Signs: min length 10
    const clinicalSigns = (historyObj["Clinical Signs"] || "")
      .toString()
      .trim();
    if (clinicalSigns.length < 10) {
      validationErrors["Clinical Signs"] =
        "Clinical Signs must be at least 10 characters";
    }
    // Population logic: total_affected and total_deaths <= total_birds
    const totalBirds = Number(historyObj["Total Birds in Farm"]);
    const totalAffected = Number(historyObj["Total Affected"]);
    const totalDeaths = Number(historyObj["Total Deaths"]);
    if (
      !isNaN(totalBirds) &&
      !isNaN(totalAffected) &&
      totalAffected > totalBirds
    ) {
      validationErrors["Total Affected"] =
        "Total Affected cannot exceed Total Birds in Farm";
    }
    if (!isNaN(totalBirds) && !isNaN(totalDeaths) && totalDeaths > totalBirds) {
      validationErrors["Total Deaths"] =
        "Total Deaths cannot exceed Total Birds in Farm";
    }

    // Validate images
    const images = formData.getAll("images") as File[];
    if (images.length === 0) {
      validationErrors["images"] = "At least one image is required";
    } else {
      images.forEach((img, index) => {
        if (!img.type.startsWith("image/")) {
          validationErrors[`image_${index}`] = "File must be an image";
        }
        if (img.size > 10 * 1024 * 1024) {
          // 10MB limit
          validationErrors[`image_${index}_size`] =
            "Image must be less than 10MB";
        }
      });
    }

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    // Build new FormData to send to backend: history as JSON string, images as files
    const backendFormData = new FormData();
    backendFormData.append("history", JSON.stringify(historyObj));
    images.forEach((img) => backendFormData.append("images", img));

    // Prepare headers
    const headers = new Headers();
    headers.append("Authorization", `${tokenType} ${token}`);

    // Log outgoing FormData for debugging
    for (const [key, value] of backendFormData.entries()) {
      if (typeof value === "string") {
        console.log(`FormData: ${key} = ${value}`);
      } else if (value instanceof File) {
        console.log(
          `FormData: ${key} = [File] name=${value.name}, type=${value.type}, size=${value.size}`
        );
      }
    }

    // Forward request to backend API
    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/diagnosis/predict`,
      {
        method: "POST",
        headers,
        body: backendFormData,
      }
    );

    // Handle backend response
    const responseData = await backendResponse.json();

    if (!backendResponse.ok) {
      // Log backend error details for debugging
      console.error("Backend 422 error details:", responseData);
      return NextResponse.json(
        {
          message: responseData.message || "Diagnosis failed",
          details: responseData.details || {},
          errors: responseData.errors || [],
          backend_detail: responseData.detail || responseData, // Add backend detail for debugging
        },
        { status: backendResponse.status }
      );
    }

    // Success response
    return NextResponse.json(responseData, {
      status: backendResponse.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Diagnosis processing error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Authentication check
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const tokenType = cookieStore.get("token_type")?.value || "Bearer";
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token found" },
        { status: 401 }
      );
    }

    //  Get user ID from query parameters
  } catch (error) {}
}
