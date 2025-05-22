import { type NextRequest, NextResponse } from "next/server";
import type { ApiKey } from "@/lib/types";

// Mock data store
let apiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "evet_prod_1a2b3c4d5e6f7g8h9i0j",
    status: "active",
    created: "2023-10-15",
    lastUsed: "2023-12-01",
    usageCount: 1245,
    user: "John Doe",
    organization: "Vet Clinic A",
  },
  {
    id: "2",
    name: "Development API Key",
    key: "evet_dev_2b3c4d5e6f7g8h9i0j1k",
    status: "suspended",
    created: "2023-09-20",
    lastUsed: "2023-11-15",
    usageCount: 567,
    user: "Jane Smith",
    organization: "Vet Clinic B",
  },
  {
    id: "3",
    name: "Testing API Key",
    key: "evet_test_3c4d5e6f7g8h9i0j1k2l",
    status: "active",
    created: "2023-11-05",
    lastUsed: "2023-12-02",
    usageCount: 892,
    user: "Bob Johnson",
    organization: "Vet Clinic C",
  },
];

let pendingApiKeyRequests: ApiKey[] = [
  {
    id: "4",
    name: "Development API Key",
    status: "pending",
    created: "2023-12-01",
    user: "John Doe",
    organization: "Vet Clinic A",
  },
  {
    id: "5",
    name: "Production API Key",
    status: "pending",
    created: "2023-12-02",
    user: "Jane Smith",
    organization: "Vet Clinic B",
  },
];

// GET /api/api-keys - Get all API keys or pending requests
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");
    const pending = searchParams.get("pending") === "true";

    // If pending is true, return pending API key requests
    if (pending) {
      return NextResponse.json(pendingApiKeyRequests);
    }

    // If id is provided, return a specific API key
    if (id) {
      const apiKey = apiKeys.find((key) => key.id === id);

      if (!apiKey) {
        return NextResponse.json(
          { message: "API key not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(apiKey);
    }

    // If userId is provided, return API keys for that user
    if (userId) {
      const userKeys = apiKeys.filter((key) => key.user === userId);
      return NextResponse.json(userKeys);
    }

    // Otherwise return all API keys
    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return NextResponse.json(
      { message: "Failed to fetch API keys" },
      { status: 500 }
    );
  }
}

// POST /api/api-keys - Create a new API key request
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.user || !data.organization) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new API key request
    const newRequest: ApiKey = {
      id: `request-${Date.now()}`,
      name: data.name,
      status: "pending",
      created: new Date().toISOString().split("T")[0],
      user: data.user,
      organization: data.organization,
    };

    pendingApiKeyRequests.push(newRequest);

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating API key request:", error);
    return NextResponse.json(
      { message: "Failed to create API key request" },
      { status: 500 }
    );
  }
}

// PUT /api/api-keys - Update an API key or approve/reject a request
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.id || !data.action) {
      return NextResponse.json(
        { message: "ID and action are required" },
        { status: 400 }
      );
    }

    // Handle different actions
    switch (data.action) {
      case "approve": {
        // Find the request
        const requestIndex = pendingApiKeyRequests.findIndex(
          (req) => req.id === data.id
        );

        if (requestIndex === -1) {
          return NextResponse.json(
            { message: "Request not found" },
            { status: 404 }
          );
        }

        // Create a new API key from the request
        const request = pendingApiKeyRequests[requestIndex];
        const newApiKey: ApiKey = {
          ...request,
          status: "active",
          key: `evet_${request.name
            .toLowerCase()
            .replace(/\s+/g, "_")}_${Math.random()
            .toString(36)
            .substring(2, 10)}`,
          lastUsed: "Never",
          usageCount: 0,
        };

        // Add to active keys and remove from pending
        apiKeys.push(newApiKey);
        pendingApiKeyRequests.splice(requestIndex, 1);

        return NextResponse.json(newApiKey);
      }

      case "reject": {
        // Remove from pending requests
        const initialLength = pendingApiKeyRequests.length;
        pendingApiKeyRequests = pendingApiKeyRequests.filter(
          (req) => req.id !== data.id
        );

        if (pendingApiKeyRequests.length === initialLength) {
          return NextResponse.json(
            { message: "Request not found" },
            { status: 404 }
          );
        }

        return NextResponse.json({ message: "Request rejected successfully" });
      }

      case "suspend": {
        // Update status to suspended
        const keyToSuspend = apiKeys.find((key) => key.id === data.id);

        if (!keyToSuspend) {
          return NextResponse.json(
            { message: "API key not found" },
            { status: 404 }
          );
        }

        keyToSuspend.status = "suspended";
        return NextResponse.json(keyToSuspend);
      }

      case "reactivate": {
        // Update status to active
        const keyToReactivate = apiKeys.find((key) => key.id === data.id);

        if (!keyToReactivate) {
          return NextResponse.json(
            { message: "API key not found" },
            { status: 404 }
          );
        }

        keyToReactivate.status = "active";
        return NextResponse.json(keyToReactivate);
      }

      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error updating API key:", error);
    return NextResponse.json(
      { message: "Failed to update API key" },
      { status: 500 }
    );
  }
}

// DELETE /api/api-keys - Delete an API key
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "API key ID is required" },
        { status: 400 }
      );
    }

    const initialLength = apiKeys.length;
    apiKeys = apiKeys.filter((key) => key.id !== id);

    if (apiKeys.length === initialLength) {
      return NextResponse.json(
        { message: "API key not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "API key deleted successfully" });
  } catch (error) {
    console.error("Error deleting API key:", error);
    return NextResponse.json(
      { message: "Failed to delete API key" },
      { status: 500 }
    );
  }
}
