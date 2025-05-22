import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/lib/auth";
import { Activity, Users, Key, FileText, BarChart3 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { RecentDiagnoses } from "@/components/dashboard/recent-diagnoses";
import { ApiUsageChart } from "@/components/dashboard/api-usage-chart";
import { UserRoleGate } from "@/components/auth/user-role-gate";
import { UserStats } from "@/components/dashboard/user-stats";

export default async function DashboardPage() {
  const user = await getCurrentUser();

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
          <UserRoleGate allowedRoles={["admin"]}>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </UserRoleGate>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Diagnoses
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {user?.role === "admin" ? "1,284" : "24"}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{user?.role === "admin" ? "12%" : "20%"} from last month
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
                  {user?.role === "admin" ? "12,543" : "156"}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{user?.role === "admin" ? "18%" : "10%"} from last month
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
                  {user?.role === "admin" ? "48" : "1"}
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
