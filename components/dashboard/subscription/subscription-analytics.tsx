"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  BarChart3,
} from "lucide-react";
import type { SubscriptionStats } from "@/lib/types";

interface SubscriptionAnalyticsProps {
  stats: SubscriptionStats;
}

export function SubscriptionAnalytics({ stats }: SubscriptionAnalyticsProps) {
  const churnRate = (
    (stats.cancelled_subscriptions / stats.total_subscriptions) *
    100
  ).toFixed(1);
  const retentionRate = (100 - Number.parseFloat(churnRate)).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Revenue Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Recurring Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.recurring_revenue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Revenue Per User
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {(stats.recurring_revenue / stats.active_subscriptions).toFixed(
                0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{churnRate}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -0.5%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Lifetime Value
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,247</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.3%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Plan Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Performance</CardTitle>
          <CardDescription>
            Revenue and subscriber metrics by plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(stats.plan_distribution).map(
            ([plan, subscribers]) => {
              const revenue =
                plan === "freemium"
                  ? 0
                  : plan === "pro"
                  ? subscribers * 49
                  : subscribers * 199;
              const percentage = (
                (subscribers / stats.total_subscriptions) *
                100
              ).toFixed(1);

              return (
                <div key={plan} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="capitalize">
                        {plan}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {subscribers} subscribers ({percentage}%)
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${revenue.toLocaleString()}/month
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${(revenue / subscribers || 0).toFixed(0)} per user
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={Number.parseFloat(percentage)}
                    className="h-2"
                  />
                </div>
              );
            }
          )}
        </CardContent>
      </Card>

      {/* Retention Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Retention Rate</CardTitle>
            <CardDescription>Customer retention over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {retentionRate}%
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {stats.active_subscriptions} out of {stats.total_subscriptions}{" "}
              customers retained
            </p>
            <Progress
              value={Number.parseFloat(retentionRate)}
              className="h-2 mt-4"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Growth</CardTitle>
            <CardDescription>New subscriptions this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600">+127</div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-green-600">+18.5%</span> compared to last
              month
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>New signups</span>
                <span>89</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Upgrades</span>
                <span>38</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
