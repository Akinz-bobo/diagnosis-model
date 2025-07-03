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
import { AlertCircle, CheckCircle, Clock, Zap } from "lucide-react";
import type { User, UserSubscription, SubscriptionPlan } from "@/lib/types";
import { UpgradePlanDialog } from "./upgrade-plan-dialog";
import { SubscriptionHistory } from "./subscription-history";
import { UsageMetrics } from "./usage-metrics";

interface UserSubscriptionViewProps {
  user: User | null;
}

export function UserSubscriptionView({ user }: UserSubscriptionViewProps) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API calls
    setSubscription({
      id: "9f09424e-ac50-40b0-b172-6b3708195961",
      plan_name: "freemium",
      user_id: "cc611606-11e7-45a4-b656-e50822d276bc",
      organization_id: "a4170a99-dcef-4d0e-bc5f-3cc117c0def1",
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
      status: "active",
      created_at: "2025-07-02T14:30:34.043947",
      updated_at: "2025-07-02T14:30:34.043947",
      allowed_calls: 100,
      remaining_calls: 100,
    });

    setAvailablePlans([
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
      {
        id: "3",
        name: "enterprise",
        description: "For large organizations with custom needs",
        price: 199,
        billing_cycle: "monthly",
        features: {
          team_allowed: "unlimited",
          api_keys_allowed: "unlimited",
          real_time_api_usage_tracking: true,
          developer_support: true,
          support_level: "dedicated",
          unlimited_diagnosis: true,
          unlimited_api_calls: true,
          analytics_dashboard: true,
          priority_queue: true,
        },
        allowed_calls: -1, // unlimited
        is_active: true,
        created_at: "2025-01-01T00:00:00Z",
        updated_at: "2025-01-01T00:00:00Z",
      },
    ]);
  }, []);

  if (!subscription) {
    return <div>Loading...</div>;
  }

  const usagePercentage =
    subscription.allowed_calls > 0
      ? ((subscription.allowed_calls - subscription.remaining_calls) /
          subscription.allowed_calls) *
        100
      : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      case "cancelled":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Subscription"
        text="Manage your subscription plan and view usage details."
        breadcrumb={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Subscription", href: "/dashboard/subscription" },
        ]}
      >
        <Button
          onClick={() => setIsUpgradeDialogOpen(true)}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Zap className="mr-2 h-4 w-4" />
          Upgrade Plan
        </Button>
      </DashboardHeader>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Plan</TabsTrigger>
          <TabsTrigger value="usage">Usage & Metrics</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-6">
          {/* Current Plan Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="capitalize">
                      {subscription.plan_name} Plan
                    </span>
                    <Badge
                      className={`${getStatusColor(
                        subscription.status
                      )} border`}
                    >
                      {getStatusIcon(subscription.status)}
                      <span className="ml-1 capitalize">
                        {subscription.status}
                      </span>
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    Active since{" "}
                    {new Date(subscription.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {subscription.plan_name === "freemium"
                      ? "Free"
                      : `$${subscription.amount_paid || 0}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {subscription.plan_name === "freemium"
                      ? "Forever"
                      : "per month"}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* API Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Calls Usage</span>
                  <span className="text-sm text-muted-foreground">
                    {subscription.allowed_calls - subscription.remaining_calls}{" "}
                    / {subscription.allowed_calls} used
                  </span>
                </div>
                <Progress value={usagePercentage} className="h-2" />
                {usagePercentage > 80 && (
                  <div className="flex items-center space-x-2 text-sm text-orange-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>You're approaching your monthly limit</span>
                  </div>
                )}
              </div>

              {/* Features Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Plan Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Team Members</span>
                      <span className="font-medium">
                        {subscription.features.team_allowed === "0"
                          ? "Solo"
                          : subscription.features.team_allowed}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>API Keys</span>
                      <span className="font-medium">
                        {subscription.features.api_keys_allowed}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Support Level</span>
                      <span className="font-medium capitalize">
                        {subscription.features.support_level}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Advanced Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Real-time Tracking</span>
                      <Badge
                        variant={
                          subscription.features.real_time_api_usage_tracking
                            ? "default"
                            : "secondary"
                        }
                      >
                        {subscription.features.real_time_api_usage_tracking
                          ? "Enabled"
                          : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Analytics Dashboard</span>
                      <Badge
                        variant={
                          subscription.features.analytics_dashboard
                            ? "default"
                            : "secondary"
                        }
                      >
                        {subscription.features.analytics_dashboard
                          ? "Enabled"
                          : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Priority Queue</span>
                      <Badge
                        variant={
                          subscription.features.priority_queue
                            ? "default"
                            : "secondary"
                        }
                      >
                        {subscription.features.priority_queue
                          ? "Enabled"
                          : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upgrade Suggestions */}
          {subscription.plan_name === "freemium" && (
            <Card className="border-teal-200 bg-teal-50/50">
              <CardHeader>
                <CardTitle className="text-teal-800">
                  Ready to unlock more features?
                </CardTitle>
                <CardDescription className="text-teal-600">
                  Upgrade to Pro and get 10x more API calls, priority support,
                  and advanced analytics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => setIsUpgradeDialogOpen(true)}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  Upgrade to Pro - $49/month
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <UsageMetrics subscription={subscription} />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <SubscriptionHistory userId={user?.id || ""} />
        </TabsContent>
      </Tabs>

      <UpgradePlanDialog
        open={isUpgradeDialogOpen}
        onOpenChange={setIsUpgradeDialogOpen}
        currentPlan={subscription}
        availablePlans={availablePlans}
        onUpgrade={(newPlan) => {
          // Handle upgrade logic
          console.log("Upgrading to:", newPlan);
        }}
      />
    </DashboardShell>
  );
}
