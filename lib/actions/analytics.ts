"use server";

import { get, handleApiError } from "@/lib/api-utils";

// Admin analytics
export async function getOverviewAnalytics() {
  try {
    return await get("/analytics?type=overview");
  } catch (error) {
    console.error("Error fetching overview analytics:", error);
    throw new Error(handleApiError(error));
  }
}

export async function getUserAnalytics() {
  try {
    return await get("/analytics?type=users");
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    throw new Error(handleApiError(error));
  }
}

export async function getApiAnalytics() {
  try {
    return await get("/analytics?type=api");
  } catch (error) {
    console.error("Error fetching API analytics:", error);
    throw new Error(handleApiError(error));
  }
}

export async function getSubscriptionAnalytics() {
  try {
    return await get("/analytics?type=subscriptions");
  } catch (error) {
    console.error("Error fetching subscription analytics:", error);
    throw new Error(handleApiError(error));
  }
}

export async function getGeographicAnalytics() {
  try {
    return await get("/analytics?type=geography");
  } catch (error) {
    console.error("Error fetching geographic analytics:", error);
    throw new Error(handleApiError(error));
  }
}

// User analytics
export async function getUserApiAnalytics(timeRange = "30days") {
  try {
    return await get(`/analytics?type=user-analytics&timeRange=${timeRange}`);
  } catch (error) {
    console.error("Error fetching user API analytics:", error);
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
export async function getUserGeographicAnalytics() {
  try {
    return await get("/analytics?type=user-geography");
  } catch (error) {
    console.error("Error fetching user geographic analytics:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserUsageAnalytics() {
  try {
    return await get("/analytics?type=user-usage");
  } catch (error) {
    console.error("Error fetching user usage analytics:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserOverviewAnalytics() {
  try {
    return await get("/analytics?type=user-overview");
  } catch (error) {
    console.error("Error fetching user overview analytics:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserSubscriptionHistory() {
  try {
    return await get("/analytics?type=user-subscription-history");
  } catch (error) {
    console.error("Error fetching user subscription history:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserApiHistory() {
  try {
    return await get("/analytics?type=user-api-history");
  } catch (error) {
    console.error("Error fetching user API history:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserGeographicHistory() {
  try {
    return await get("/analytics?type=user-geographic-history");
  } catch (error) {
    console.error("Error fetching user geographic history:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserUsageHistory() {
  try {
    return await get("/analytics?type=user-usage-history");
  } catch (error) {
    console.error("Error fetching user usage history:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserOverviewHistory() {
  try {
    return await get("/analytics?type=user-overview-history");
  } catch (error) {
    console.error("Error fetching user overview history:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserSubscriptionHistoryById(userId: string) {
  try {
    return await get(
      `/analytics?type=user-subscription-history&userId=${userId}`
    );
  } catch (error) {
    console.error("Error fetching user subscription history by ID:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserApiHistoryById(userId: string) {
  try {
    return await get(`/analytics?type=user-api-history&userId=${userId}`);
  } catch (error) {
    console.error("Error fetching user API history by ID:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserGeographicHistoryById(userId: string) {
  try {
    return await get(
      `/analytics?type=user-geographic-history&userId=${userId}`
    );
  } catch (error) {
    console.error("Error fetching user geographic history by ID:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserUsageHistoryById(userId: string) {
  try {
    return await get(`/analytics?type=user-usage-history&userId=${userId}`);
  } catch (error) {
    console.error("Error fetching user usage history by ID:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserOverviewHistoryById(userId: string) {
  try {
    return await get(`/analytics?type=user-overview-history&userId=${userId}`);
  } catch (error) {
    console.error("Error fetching user overview history by ID:", error);
    throw new Error(handleApiError(error));
  }
}
export async function getUserSubscriptionHistoryByIdAndTimeRange(
  userId: string,
  timeRange: string
) {
  try {
    return await get(
      `/analytics?type=user-subscription-history&userId=${userId}&timeRange=${timeRange}`
    );
  } catch (error) {
    console.error(
      "Error fetching user subscription history by ID and time range:",
      error
    );
    throw new Error(handleApiError(error));
  }
}
export async function getUserApiHistoryByIdAndTimeRange(
  userId: string,
  timeRange: string
) {
  try {
    return await get(
      `/analytics?type=user-api-history&userId=${userId}&timeRange=${timeRange}`
    );
  } catch (error) {
    console.error(
      "Error fetching user API history by ID and time range:",
      error
    );
    throw new Error(handleApiError(error));
  }
}
export async function getUserGeographicHistoryByIdAndTimeRange(
  userId: string,
  timeRange: string
) {
  try {
    return await get(
      `/analytics?type=user-geographic-history&userId=${userId}&timeRange=${timeRange}`
    );
  } catch (error) {
    console.error(
      "Error fetching user geographic history by ID and time range:",
      error
    );
    throw new Error(handleApiError(error));
  }
}
export async function getUserUsageHistoryByIdAndTimeRange(
  userId: string,
  timeRange: string
) {
  try {
    return await get(
      `/analytics?type=user-usage-history&userId=${userId}&timeRange=${timeRange}`
    );
  } catch (error) {
    console.error(
      "Error fetching user usage history by ID and time range:",
      error
    );
    throw new Error(handleApiError(error));
  }
}
export async function getUserOverviewHistoryByIdAndTimeRange(
  userId: string,
  timeRange: string
) {
  try {
    return await get(
      `/analytics?type=user-overview-history&userId=${userId}&timeRange=${timeRange}`
    );
  } catch (error) {
    console.error(
      "Error fetching user overview history by ID and time range:",
      error
    );
    throw new Error(handleApiError(error));
  }
}
export async function getUserSubscriptionHistoryByIdAndTimeRangeAndPlan(
  userId: string,
  timeRange: string,
  plan: string
) {
  try {
    return await get(
      `/analytics?type=user-subscription-history&userId=${userId}&timeRange=${timeRange}&plan=${plan}`
    );
  } catch (error) {
    console.error(
      "Error fetching user subscription history by ID, time range, and plan:",
      error
    );
    throw new Error(handleApiError(error));
  }
}
export async function getUserApiHistoryByIdAndTimeRangeAndPlan(
  userId: string,
  timeRange: string,
  plan: string
) {
  try {
    return await get(
      `/analytics?type=user-api-history&userId=${userId}&timeRange=${timeRange}&plan=${plan}`
    );
  } catch (error) {
    console.error(
      "Error fetching user API history by ID, time range, and plan:",
      error
    );
    throw new Error(handleApiError(error));
  }
}
export async function getUserGeographicHistoryByIdAndTimeRangeAndPlan(
  userId: string,
  timeRange: string,
  plan: string
) {
  try {
    return await get(
      `/analytics?type=user-geographic-history&userId=${userId}&timeRange=${timeRange}&plan=${plan}`
    );
  } catch (error) {
    console.error(
      "Error fetching user geographic history by ID, time range, and plan:",
      error
    );
    throw new Error(handleApiError(error));
  }
}
export async function getUserUsageHistoryByIdAndTimeRangeAndPlan(
  userId: string,
  timeRange: string,
  plan: string
) {
  try {
    return await get(
      `/analytics?type=user-usage-history&userId=${userId}&timeRange=${timeRange}&plan=${plan}`
    );
  } catch (error) {
    console.error(
      "Error fetching user usage history by ID, time range, and plan:",
      error
    );
    throw new Error(handleApiError(error));
  }
}
