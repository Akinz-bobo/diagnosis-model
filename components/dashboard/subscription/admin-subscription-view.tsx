"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, TrendingUp, Users, DollarSign, BarChart3 } from "lucide-react";
import type { User, SubscriptionPlan, SubscriptionStats } from "@/lib/types";
import { CreatePlanDialog } from "./create-plan-dialog";
import { PlanManagementTable } from "./plan-management-table";
import { SubscriptionAnalytics } from "./subscription-analytics";
import { RecentPurchases } from "./recent-purchases";

interface AdminSubscriptionViewProps {
  user: User | null;
}

export function AdminSubscriptionView({ user }: AdminSubscriptionViewProps) {
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      total_subscriptions: 1247,
      active_subscriptions: 1089,
      expired_subscriptions: 89,
      cancelled_subscriptions: 69,
      recurring_revenue: 52340,
      plan_distribution: {
        freemium: 756,
        pro: 298,
        enterprise: 35,
      },
      recent_purchases: [
        {
          id: "1",
          plan_name: "pro",
          user_id: "user1",
          features: {
            team_allowed: "5",
            api_keys_allowed: "3",
            real_time_api_usage_tracking: true,
            developer_support: true,
            support_level: "priority",
            unlimited_diagnosis: false,
            unlimited_api_calls: false,
            analytics_dashboard: true,
            priority_queue: true,
          },
          status: "active",
          created_at: "2025-01-02T10:30:00Z",
          updated_at: "2025-01-02T10:30:00Z",
          allowed_calls: 1000,
          remaining_calls: 856,
          amount_paid: 49,
        },
      ],
    });

    setPlans([
      {
        id: "1",
        name: "freemium",
        description: "Perfect for individuals getting started",
        price: 0,
        billing_cycle: "monthly",
        features: {
          team_allowed: "0",
          api_keys_allowed: "1",
          real_time_api_usage_tracking: false,
          developer_support: false,
          support_level: "community",
          unlimited_diagnosis: false,
          unlimited_api_calls: false,
          analytics_dashboard: false,
          priority_queue: false,
        },
        allowed_calls: 100,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      },
      {
        id: "2",
        name: "pro",
        description: "For growing veterinary practices",
        price: 49,
        billing_cycle: "monthly",
        features: {
          team_allowed: "5",
          api_keys_allowed: "3",
          real_time_api_usage_tracking: true,
          developer_support: true,
          support_level: "priority",
          unlimited_diagnosis: false,
          unlimited_api_calls: false,
          analytics_dashboard: true,
          priority_queue: true,
        },
        allowed_calls: 1000,
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      },
    ]);
  }, []);

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Subscription Management"
        text="Manage subscription plans, pricing, and monitor subscription analytics."
        breadcrumb={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Subscription Management", href: "/dashboard/subscription" },
        ]}
      >
        <Button
          onClick={() => setIsCreatePlanOpen(true)}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Plan
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Subscriptions
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.total_subscriptions.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Subscriptions
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.active_subscriptions.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {(
                    (stats.active_subscriptions / stats.total_subscriptions) *
                    100
                  ).toFixed(1)}
                  % of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Monthly Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.recurring_revenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Churn Rate
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3%</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">-0.5%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Plan Distribution */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription>
                  Current subscription distribution across plans
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(stats.plan_distribution).map(
                  ([plan, count]) => (
                    <div key={plan} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="capitalize">
                            {plan}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {count} subscribers
                          </span>
                        </div>
                        <span className="text-sm font-medium">
                          {((count / stats.total_subscriptions) * 100).toFixed(
                            1
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(count / stats.total_subscriptions) * 100}
                        className="h-2"
                      />
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            <RecentPurchases purchases={stats.recent_purchases} />
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <PlanManagementTable plans={plans} onPlansChange={setPlans} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <SubscriptionAnalytics stats={stats} />
        </TabsContent>

        <TabsContent value="subscribers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subscriber Management</CardTitle>
              <CardDescription>
                View and manage individual subscriber accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Subscriber management interface coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CreatePlanDialog
        open={isCreatePlanOpen}
        onOpenChange={setIsCreatePlanOpen}
        onPlanCreated={(newPlan: any) => setPlans([...plans, newPlan])}
      />
    </DashboardShell>
  );
}
