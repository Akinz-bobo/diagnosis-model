import { type NextRequest, NextResponse } from "next/server";

// Mock data store
const subscriptions = [
  {
    id: "1",
    userId: "2",
    plan: "free",
    status: "active",
    startDate: "2023-01-01",
    endDate: null,
    paymentMethod: null,
  },
  {
    id: "2",
    userId: "3",
    plan: "pro",
    status: "active",
    startDate: "2023-03-15",
    endDate: null,
    paymentMethod: "card_1234",
  },
  {
    id: "3",
    userId: "4",
    plan: "enterprise",
    status: "active",
    startDate: "2023-02-10",
    endDate: null,
    paymentMethod: "card_5678",
  },
];

// GET /api/subscriptions - Get subscription information
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Find subscription for the user
    const subscription = subscriptions.find((sub) => sub.userId === userId);

    if (!subscription) {
      // Return a default free subscription if none exists
      return NextResponse.json({
        id: null,
        userId,
        plan: "free",
        status: "active",
        startDate: new Date().toISOString().split("T")[0],
        endDate: null,
        paymentMethod: null,
      });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { message: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions - Create or update a subscription
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.userId || !data.plan) {
      return NextResponse.json(
        { message: "User ID and plan are required" },
        { status: 400 }
      );
    }

    // Find existing subscription
    const subscriptionIndex = subscriptions.findIndex(
      (sub) => sub.userId === data.userId
    );

    if (subscriptionIndex !== -1) {
      // Update existing subscription
      subscriptions[subscriptionIndex] = {
        ...subscriptions[subscriptionIndex],
        plan: data.plan,
        status: "active",
        startDate: new Date().toISOString().split("T")[0],
        paymentMethod:
          data.paymentMethodId ||
          subscriptions[subscriptionIndex].paymentMethod,
      };

      return NextResponse.json(subscriptions[subscriptionIndex]);
    } else {
      // Create new subscription
      const newSubscription = {
        id: `sub-${Date.now()}`,
        userId: data.userId,
        plan: data.plan,
        status: "active",
        startDate: new Date().toISOString().split("T")[0],
        endDate: null,
        paymentMethod: data.paymentMethodId || null,
      };

      subscriptions.push(newSubscription);
      return NextResponse.json(newSubscription, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating/updating subscription:", error);
    return NextResponse.json(
      { message: "Failed to create/update subscription" },
      { status: 500 }
    );
  }
}

// PUT /api/subscriptions - Cancel a subscription
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.userId || !data.action) {
      return NextResponse.json(
        { message: "User ID and action are required" },
        { status: 400 }
      );
    }

    // Find subscription
    const subscriptionIndex = subscriptions.findIndex(
      (sub) => sub.userId === data.userId
    );

    if (subscriptionIndex === -1) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }

    // Handle different actions
    switch (data.action) {
      case "cancel":
        // Update subscription
        subscriptions[subscriptionIndex] = {
          ...subscriptions[subscriptionIndex],
          status: "cancelled",
          endDate: new Date().toISOString().split("T")[0],
        };

        return NextResponse.json(subscriptions[subscriptionIndex]);

      case "reactivate":
        // Update subscription
        subscriptions[subscriptionIndex] = {
          ...subscriptions[subscriptionIndex],
          status: "active",
          endDate: null,
        };

        return NextResponse.json(subscriptions[subscriptionIndex]);

      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { message: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
