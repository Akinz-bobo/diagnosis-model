/**
 * API utilities for making requests and handling errors
 */

// Custom API error class
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Helper function to handle API errors
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return `Error (${error.status}): ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred";
}

// Helper to safely get token from localStorage (only on client)
function getTokenAndType() {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    const token = localStorage.getItem("token");
    const tokenType = localStorage.getItem("token_type") || "bearer";
    return { token, tokenType };
  }
  return { token: null, tokenType: "bearer" };
}

// Generic GET request function
export async function get<T>(endpoint: string): Promise<T> {
  try {
    const { token, tokenType } = getTokenAndType();

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `${tokenType} ${token}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api${endpoint}`,
      {
        method: "GET",
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Failed to fetch data from ${endpoint}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`GET request to ${endpoint} failed:`, error);
    throw error;
  }
}

// Generic POST request function
export async function post<T>(endpoint: string, data: any): Promise<T> {
  try {
    const { token, tokenType } = getTokenAndType();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `${tokenType} ${token}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api${endpoint}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Failed to post data to ${endpoint}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`POST request to ${endpoint} failed:`, error);
    throw error;
  }
}

// Generic PUT request function
export async function put<T>(endpoint: string, data: any): Promise<T> {
  try {
    const { token, tokenType } = getTokenAndType();

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `${tokenType} ${token}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api${endpoint}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Failed to update data at ${endpoint}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`PUT request to ${endpoint} failed:`, error);
    throw error;
  }
}

// Generic DELETE request function
export async function del<T>(endpoint: string): Promise<T> {
  try {
    const { token, tokenType } = getTokenAndType();

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `${tokenType} ${token}`;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api${endpoint}`,
      {
        method: "DELETE",
        headers,
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Failed to delete data at ${endpoint}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`DELETE request to ${endpoint} failed:`, error);
    throw error;
  }
}
