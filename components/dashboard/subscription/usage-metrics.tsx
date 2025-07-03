"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import type { UserSubscription } from "@/lib/types";

interface UsageMetricsProps {
  subscription: UserSubscription;
}

export function UsageMetrics({ subscription }: UsageMetricsProps) {
  const usagePercentage =
    subscription.allowed_calls > 0
      ? ((subscription.allowed_calls - subscription.remaining_calls) /
          subscription.allowed_calls) *
        100
      : 0;

  const usedCalls = subscription.allowed_calls - subscription.remaining_calls;
  const dailyAverage = Math.round(usedCalls / 30); // Assuming 30 days in month

  return (
    <div className="space-y-6">
      {/* Usage Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              API Calls Used
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usedCalls.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              of {subscription.allowed_calls.toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Remaining Calls
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription.remaining_calls.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {usagePercentage.toFixed(1)}% used this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyAverage}</div>
            <p className="text-xs text-muted-foreground">calls per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Days Remaining
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dailyAverage > 0
                ? Math.floor(subscription.remaining_calls / dailyAverage)
                : "∞"}
            </div>
            <p className="text-xs text-muted-foreground">
              at current usage rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Usage Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Usage</CardTitle>
          <CardDescription>
            Your API usage for the current billing period
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Calls</span>
              <span className="text-sm text-muted-foreground">
                {usedCalls} / {subscription.allowed_calls}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-3" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>{subscription.allowed_calls.toLocaleString()}</span>
            </div>
          </div>

          {usagePercentage > 80 && (
            <div className="flex items-center space-x-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div className="text-sm text-orange-800">
                <strong>Usage Warning:</strong> You've used{" "}
                {usagePercentage.toFixed(1)}% of your monthly limit. Consider
                upgrading your plan to avoid service interruption.
              </div>
            </div>
          )}

          {usagePercentage <= 50 && (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div className="text-sm text-green-800">
                You're well within your usage limits. Great job managing your
                API consumption!
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feature Usage */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Usage</CardTitle>
          <CardDescription>Track usage of your plan features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API Keys</span>
                <Badge variant="outline">
                  1 / {subscription.features.api_keys_allowed} used
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Team Members</span>
                <Badge variant="outline">
                  {subscription.features.team_allowed === "0"
                    ? "Solo plan"
                    : `0 / ${subscription.features.team_allowed} used`}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Real-time Tracking</span>
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
                <span className="text-sm font-medium">Analytics Dashboard</span>
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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
