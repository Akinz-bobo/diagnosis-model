// app/api/diagnosis/route.ts
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const tokenType = cookieStore.get("token_type")?.value || "Bearer";

  if (!token) {
    return new Response(
      JSON.stringify({ message: "Unauthorized: No token found" }),
      { status: 401 }
    );
  }

  const formData = await req.formData();

  const backendRes = await fetch(
    process.env.NEXT_PUBLIC_API_BASE_URL + "/api/v1/diagnosis/predict",
    {
      method: "POST",
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
      body: formData,
    }
  );

  const responseData = await backendRes.json();
  return new Response(JSON.stringify(responseData), {
    status: backendRes.status,
    headers: { "Content-Type": "application/json" },
  });
}
