import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserStats } from "@/components/dashboard/user-stats";
import { ApiUsageChart } from "@/components/dashboard/api-usage-chart";
import { AnalyticsUsageByEndpoint } from "@/components/dashboard/analytics/usage-by-endpoint";
import { AnalyticsUserGrowth } from "@/components/dashboard/analytics/user-growth";
import { AnalyticsSubscriptionDistribution } from "@/components/dashboard/analytics/subscription-distribution";
import { AnalyticsGeographicDistribution } from "@/components/dashboard/analytics/geographic-distribution";
import { AnalyticsActiveUsers } from "@/components/dashboard/analytics/active-users";

export const metadata = {
  title: "Analytics | eVet Dashboard",
  description: "View detailed analytics about platform usage and performance.",
};

export default async function AnalyticsPage() {
  const user = await getCurrentUser();

  // Only allow admin access
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Analytics"
        text="View detailed analytics about platform usage and performance."
        breadcrumb={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Analytics", href: "/dashboard/analytics" },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+18 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">
              71.6% of total users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              API Calls (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2M</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245ms</div>
            <p className="text-xs text-muted-foreground">
              -18ms from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="api">API Usage</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Over Time</CardTitle>
              <CardDescription>
                Total API calls across all endpoints over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ApiUsageChart detailed />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>
                  New user registrations over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsUserGrowth />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>
                  Distribution of users across subscription plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsSubscriptionDistribution />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>
                New user registrations over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsUserGrowth detailed />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Users</CardTitle>
              <CardDescription>
                Daily, weekly, and monthly active users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsActiveUsers />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Statistics</CardTitle>
              <CardDescription>
                Detailed user statistics and demographics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserStats />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Over Time</CardTitle>
              <CardDescription>
                Total API calls across all endpoints over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiUsageChart detailed />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage by Endpoint</CardTitle>
              <CardDescription>
                Distribution of API calls across different endpoints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsUsageByEndpoint />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Distribution</CardTitle>
              <CardDescription>
                Distribution of users across subscription plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsSubscriptionDistribution detailed />
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Free Plan Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">250</div>
                <p className="text-xs text-muted-foreground">
                  73.1% of total users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pro Plan Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">80</div>
                <p className="text-xs text-muted-foreground">
                  23.4% of total users
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Enterprise Plan Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  3.5% of total users
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Recurring Revenue</CardTitle>
              <CardDescription>MRR growth over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <p className="text-muted-foreground">
                MRR chart will be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>
                Distribution of users across different regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsGeographicDistribution />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
