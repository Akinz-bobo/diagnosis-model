import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserApiUsage } from "@/components/dashboard/my-analytics/user-api-usage";
import { UserEndpointBreakdown } from "@/components/dashboard/my-analytics/user-endpoint-breakdown";
import { UserActivityLog } from "@/components/dashboard/my-analytics/user-activity-log";
import { UserUsageLimits } from "@/components/dashboard/my-analytics/user-usage-limits";
import { redirect } from "next/navigation";
import { Activity, Clock, CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "My Analytics | eVet",
  description: "View your API usage and activity analytics",
};

export default async function MyAnalyticsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  // Mock data - in a real app, this would come from your database
  const totalApiCalls = 156;
  const successRate = 98.2;
  const avgResponseTime = 245; // ms
  const lastWeekChange = 12; // percent

  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Analytics"
        text="Monitor your API usage and activity metrics"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total API Calls
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApiCalls}</div>
            <p className="text-xs text-muted-foreground">
              +{lastWeekChange}% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {successRate > 95 ? "Healthy" : "Needs attention"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgResponseTime}ms</div>
            <p className="text-xs text-muted-foreground">
              {avgResponseTime < 300 ? "Good" : "Slow"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(100 - successRate).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {100 - successRate < 5 ? "Low" : "High"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="space-y-4 mt-6">
        <TabsList>
          <TabsTrigger value="usage">API Usage</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoint Breakdown</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="limits">Usage Limits</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Over Time</CardTitle>
              <CardDescription>
                Your API call volume for the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <UserApiUsage />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Endpoint Breakdown</CardTitle>
              <CardDescription>API calls by endpoint</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <UserEndpointBreakdown />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your recent API calls and actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserActivityLog />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usage Limits</CardTitle>
              <CardDescription>
                Your current plan limits and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserUsageLimits />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
