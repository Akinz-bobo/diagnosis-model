import { type NextRequest, NextResponse } from "next/server";

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const type = searchParams.get("type") || "overview";
    const timeRange = searchParams.get("timeRange") || "30days";

    // Return different mock data based on the type parameter
    switch (type) {
      case "overview": {
        return NextResponse.json({
          totalUsers: 342,
          activeUsers: 245,
          apiCalls: 1200000,
          avgResponseTime: 245,
          userGrowth: [
            { month: "Jan", users: 120, newUsers: 120 },
            { month: "Feb", users: 145, newUsers: 25 },
            { month: "Mar", users: 162, newUsers: 17 },
            { month: "Apr", users: 190, newUsers: 28 },
            { month: "May", users: 210, newUsers: 20 },
            { month: "Jun", users: 245, newUsers: 35 },
            { month: "Jul", users: 270, newUsers: 25 },
            { month: "Aug", users: 290, newUsers: 20 },
            { month: "Sep", users: 310, newUsers: 20 },
            { month: "Oct", users: 325, newUsers: 15 },
            { month: "Nov", users: 335, newUsers: 10 },
            { month: "Dec", users: 342, newUsers: 7 },
          ],
          apiUsage: [
            { date: "2023-01-01", calls: 25000 },
            { date: "2023-02-01", calls: 40000 },
            { date: "2023-03-01", calls: 45000 },
            { date: "2023-04-01", calls: 60000 },
            { date: "2023-05-01", calls: 75000 },
            { date: "2023-06-01", calls: 90000 },
            { date: "2023-07-01", calls: 110000 },
            { date: "2023-08-01", calls: 125000 },
            { date: "2023-09-01", calls: 140000 },
            { date: "2023-10-01", calls: 160000 },
            { date: "2023-11-01", calls: 180000 },
            { date: "2023-12-01", calls: 200000 },
          ],
          subscriptionDistribution: [
            { name: "Free", value: 250, color: "#94a3b8" },
            { name: "Pro", value: 80, color: "#14b8a6" },
            { name: "Enterprise", value: 12, color: "#0f766e" },
          ],
        });
      }

      case "users": {
        return NextResponse.json({
          activeUsers: {
            daily: [
              { date: "05/01", users: 120 },
              { date: "05/02", users: 132 },
              { date: "05/03", users: 145 },
              { date: "05/04", users: 140 },
              { date: "05/05", users: 158 },
              { date: "05/06", users: 142 },
              { date: "05/07", users: 135 },
              { date: "05/08", users: 148 },
              { date: "05/09", users: 152 },
              { date: "05/10", users: 159 },
              { date: "05/11", users: 162 },
              { date: "05/12", users: 155 },
              { date: "05/13", users: 172 },
              { date: "05/14", users: 160 },
            ],
            weekly: [
              { week: "W1 Apr", users: 185 },
              { week: "W2 Apr", users: 190 },
              { week: "W3 Apr", users: 198 },
              { week: "W4 Apr", users: 205 },
              { week: "W1 May", users: 210 },
              { week: "W2 May", users: 220 },
              { week: "W3 May", users: 225 },
              { week: "W4 May", users: 235 },
              { week: "W1 Jun", users: 245 },
            ],
            monthly: [
              { month: "Jan", users: 180 },
              { month: "Feb", users: 195 },
              { month: "Mar", users: 210 },
              { month: "Apr", users: 225 },
              { month: "May", users: 245 },
            ],
          },
          userStats: {
            newUsers: 18,
            activeUsers: 245,
            inactiveUsers: 97,
            verifiedUsers: 320,
            unverifiedUsers: 22,
          },
        });
      }

      case "api": {
        return NextResponse.json({
          endpointData: [
            {
              name: "/api/diagnose",
              calls: 580000,
              errors: 2900,
            },
            {
              name: "/api/pets",
              calls: 320000,
              errors: 1600,
            },
            {
              name: "/api/users",
              calls: 150000,
              errors: 750,
            },
            {
              name: "/api/breeds",
              calls: 95000,
              errors: 475,
            },
            {
              name: "/api/conditions",
              calls: 55000,
              errors: 275,
            },
          ],
          apiUsageOverTime: [
            { date: "2023-01-01", calls: 25000, errors: 1250 },
            { date: "2023-02-01", calls: 40000, errors: 2000 },
            { date: "2023-03-01", calls: 45000, errors: 2250 },
            { date: "2023-04-01", calls: 60000, errors: 3000 },
            { date: "2023-05-01", calls: 75000, errors: 3750 },
            { date: "2023-06-01", calls: 90000, errors: 4500 },
            { date: "2023-07-01", calls: 110000, errors: 5500 },
            { date: "2023-08-01", calls: 125000, errors: 6250 },
            { date: "2023-09-01", calls: 140000, errors: 7000 },
            { date: "2023-10-01", calls: 160000, errors: 8000 },
            { date: "2023-11-01", calls: 180000, errors: 9000 },
            { date: "2023-12-01", calls: 200000, errors: 10000 },
          ],
        });
      }

      case "subscriptions": {
        return NextResponse.json({
          subscriptionDistribution: [
            { name: "Free", value: 250, color: "#94a3b8" },
            { name: "Pro", value: 80, color: "#14b8a6" },
            { name: "Enterprise", value: 12, color: "#0f766e" },
          ],
          mrr: [
            { month: "Jan", value: 5000 },
            { month: "Feb", value: 6200 },
            { month: "Mar", value: 7500 },
            { month: "Apr", value: 8100 },
            { month: "May", value: 9400 },
            { month: "Jun", value: 10200 },
            { month: "Jul", value: 11500 },
            { month: "Aug", value: 12800 },
            { month: "Sep", value: 13600 },
            { month: "Oct", value: 14200 },
            { month: "Nov", value: 15000 },
            { month: "Dec", value: 16200 },
          ],
        });
      }

      case "geography": {
        return NextResponse.json({
          geographicData: [
            { name: "North America", value: 145, color: "#14b8a6" },
            { name: "Europe", value: 98, color: "#0ea5e9" },
            { name: "Asia", value: 56, color: "#8b5cf6" },
            { name: "South America", value: 24, color: "#f59e0b" },
            { name: "Africa", value: 12, color: "#ef4444" },
            { name: "Oceania", value: 7, color: "#84cc16" },
          ],
        });
      }

      case "user-analytics": {
        // For individual user analytics
        return NextResponse.json({
          totalApiCalls: 156,
          successRate: 98.2,
          avgResponseTime: 245,
          lastWeekChange: 12,
          apiUsage: {
            "7days": [
              { date: "May 9", calls: 11, errors: 0 },
              { date: "May 10", calls: 8, errors: 0 },
              { date: "May 11", calls: 7, errors: 0 },
              { date: "May 12", calls: 6, errors: 1 },
              { date: "May 13", calls: 5, errors: 0 },
              { date: "May 14", calls: 4, errors: 0 },
              { date: "May 15", calls: 7, errors: 0 },
            ],
            "30days": [
              { date: "May 1", calls: 4, errors: 0 },
              { date: "May 2", calls: 6, errors: 0 },
              { date: "May 3", calls: 5, errors: 1 },
              { date: "May 4", calls: 8, errors: 0 },
              { date: "May 5", calls: 7, errors: 0 },
              { date: "May 6", calls: 3, errors: 0 },
              { date: "May 7", calls: 4, errors: 0 },
              { date: "May 8", calls: 9, errors: 1 },
              { date: "May 9", calls: 11, errors: 0 },
              { date: "May 10", calls: 8, errors: 0 },
              { date: "May 11", calls: 7, errors: 0 },
              { date: "May 12", calls: 6, errors: 1 },
              { date: "May 13", calls: 5, errors: 0 },
              { date: "May 14", calls: 4, errors: 0 },
              { date: "May 15", calls: 7, errors: 0 },
              { date: "May 16", calls: 8, errors: 0 },
              { date: "May 17", calls: 9, errors: 1 },
              { date: "May 18", calls: 10, errors: 0 },
              { date: "May 19", calls: 12, errors: 0 },
              { date: "May 20", calls: 11, errors: 0 },
              { date: "May 21", calls: 9, errors: 0 },
              { date: "May 22", calls: 8, errors: 1 },
              { date: "May 23", calls: 7, errors: 0 },
              { date: "May 24", calls: 6, errors: 0 },
              { date: "May 25", calls: 5, errors: 0 },
              { date: "May 26", calls: 4, errors: 0 },
              { date: "May 27", calls: 6, errors: 0 },
              { date: "May 28", calls: 7, errors: 1 },
              { date: "May 29", calls: 8, errors: 0 },
              { date: "May 30", calls: 9, errors: 0 },
            ],
            weekly: [
              { date: "Week 1", calls: 37, errors: 1 },
              { date: "Week 2", calls: 45, errors: 2 },
              { date: "Week 3", calls: 55, errors: 1 },
              { date: "Week 4", calls: 39, errors: 1 },
            ],
            monthly: [
              { date: "Jan", calls: 120, errors: 5 },
              { date: "Feb", calls: 145, errors: 6 },
              { date: "Mar", calls: 162, errors: 4 },
              { date: "Apr", calls: 158, errors: 7 },
              { date: "May", calls: 156, errors: 3 },
            ],
          },
          endpointBreakdown: [
            { name: "Diagnosis API", value: 98 },
            { name: "Authentication", value: 32 },
            { name: "User Profile", value: 18 },
            { name: "File Upload", value: 8 },
          ],
          activityLog: [
            {
              id: 1,
              endpoint: "/api/diagnose",
              method: "POST",
              status: 200,
              timestamp: "2025-05-15T08:45:23Z",
              duration: 235,
            },
            {
              id: 2,
              endpoint: "/api/auth/verify",
              method: "GET",
              status: 200,
              timestamp: "2025-05-15T08:44:12Z",
              duration: 124,
            },
            {
              id: 3,
              endpoint: "/api/diagnose",
              method: "POST",
              status: 200,
              timestamp: "2025-05-15T07:32:45Z",
              duration: 312,
            },
            {
              id: 4,
              endpoint: "/api/user/profile",
              method: "GET",
              status: 200,
              timestamp: "2025-05-15T07:30:18Z",
              duration: 98,
            },
            {
              id: 5,
              endpoint: "/api/diagnose",
              method: "POST",
              status: 400,
              timestamp: "2025-05-14T16:22:33Z",
              duration: 187,
              error: "Invalid input parameters",
            },
            {
              id: 6,
              endpoint: "/api/diagnose",
              method: "POST",
              status: 200,
              timestamp: "2025-05-14T14:15:42Z",
              duration: 267,
            },
            {
              id: 7,
              endpoint: "/api/auth/verify",
              method: "GET",
              status: 200,
              timestamp: "2025-05-14T14:14:36Z",
              duration: 112,
            },
            {
              id: 8,
              endpoint: "/api/file/upload",
              method: "POST",
              status: 200,
              timestamp: "2025-05-14T11:08:19Z",
              duration: 543,
            },
          ],
          usageLimits: [
            {
              name: "API Calls",
              used: 156,
              limit: 500,
              unit: "calls",
            },
            {
              name: "Diagnoses",
              used: 24,
              limit: 50,
              unit: "diagnoses",
            },
            {
              name: "File Storage",
              used: 128,
              limit: 500,
              unit: "MB",
            },
            {
              name: "Users",
              used: 3,
              limit: 5,
              unit: "users",
            },
          ],
        });
      }

      default:
        return NextResponse.json(
          { message: "Invalid analytics type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
