"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Users, Key, FileText, BarChart3 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { RecentDiagnoses } from "@/components/dashboard/recent-diagnoses";
import { ApiUsageChart } from "@/components/dashboard/api-usage-chart";
import { UserRoleGate } from "@/components/auth/user-role-gate";
import { UserStats } from "@/components/dashboard/user-stats";
import { useCurrentUserQuery } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";
import { useUsersByOrganizationQuery } from "@/hooks/use-user";
import { useOrganizationQuery } from "@/hooks/use-organization";
import { useApiKeysQuery } from "@/hooks/use-api-key";

export default function DashboardPage() {
  const { data: user, isLoading, error } = useCurrentUserQuery();
  // Fetch organization and members if user is org_admin or user
  const orgId = user?.organization_id;
  const isOrgUser = user && ["org_admin", "user"].includes(user.role);
  const {
    data: org,
    isLoading: orgLoading,
    error: orgError,
  } = useOrganizationQuery(orgId || "");
  const {
    data: orgMembers,
    isLoading: membersLoading,
    error: membersError,
  } = useUsersByOrganizationQuery(orgId || "", !!orgId && isOrgUser);
  const {
    data: orgApiKeys,
    isLoading: apiKeysLoading,
    error: apiKeysError,
  } = useApiKeysQuery();

  if (isLoading) {
    return (
      <DashboardShell>
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="text-red-500 text-center py-8">
          Error: {error.message}
        </div>
      </DashboardShell>
    );
  }

  if (!user) {
    return (
      <DashboardShell>
        <div className="text-center py-8">No user found.</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Welcome back! Here's an overview of your account."
      />
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <UserRoleGate allowedRoles={["admin", "org_admin"]}>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </UserRoleGate>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {user?.role === "admin"
                    ? "Total Diagnoses"
                    : "Organization Diagnoses"}
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user?.role === "admin"
                    ? "1,284"
                    : orgLoading
                    ? "..."
                    : org?.diagnosis_count ?? "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  +
                  {user?.role === "admin"
                    ? "12%"
                    : org?.diagnosis_growth ?? "0%"}{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user?.role === "admin"
                    ? "12,543"
                    : orgLoading
                    ? "..."
                    : org?.api_call_count ?? "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  +
                  {user?.role === "admin"
                    ? "18%"
                    : org?.api_call_growth ?? "0%"}{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Keys</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user?.role === "admin"
                    ? "48"
                    : apiKeysLoading
                    ? "..."
                    : (orgApiKeys || []).filter((k) => k.organization === orgId)
                        .length}
                </div>
                <p className="text-xs text-muted-foreground">
                  {user?.role === "admin" ? "+4 pending approval" : "Active"}
                </p>
              </CardContent>
            </Card>
            <UserRoleGate allowedRoles={["admin"]}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">342</div>
                  <p className="text-xs text-muted-foreground">
                    +18 new users this week
                  </p>
                </CardContent>
              </Card>
            </UserRoleGate>
            <UserRoleGate allowedRoles={["org_admin", "user"]}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {membersLoading ? "..." : orgMembers?.length ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {membersLoading ? "" : "+0 new members this week"}
                  </p>
                </CardContent>
              </Card>
            </UserRoleGate>
            <UserRoleGate allowedRoles={["user"]}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscription
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Free</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-teal-600 font-medium">
                      Upgrade to Pro
                    </span>{" "}
                    for unlimited access
                  </p>
                </CardContent>
              </Card>
            </UserRoleGate>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ApiUsageChart />
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Diagnoses</CardTitle>
                <CardDescription>
                  Your most recent diagnostic results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentDiagnoses />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Detailed API Usage</CardTitle>
              <CardDescription>
                Your API usage over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ApiUsageChart detailed />
            </CardContent>
          </Card>
        </TabsContent>
        <UserRoleGate allowedRoles={["admin"]}>
          <TabsContent value="admin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Statistics</CardTitle>
                <CardDescription>
                  Overview of user activity and registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserStats />
              </CardContent>
            </Card>
          </TabsContent>
        </UserRoleGate>
      </Tabs>
    </DashboardShell>
  );
}
