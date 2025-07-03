"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import type { UserSubscription } from "@/lib/types";

interface RecentPurchasesProps {
  purchases: UserSubscription[];
}

export function RecentPurchases({ purchases }: RecentPurchasesProps) {
  // Mock additional purchases for demonstration
  const mockPurchases = [
    ...purchases,
    {
      id: "2",
      plan_name: "enterprise",
      user_id: "user2",
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
      status: "active",
      created_at: "2025-01-01T15:45:00Z",
      updated_at: "2025-01-01T15:45:00Z",
      allowed_calls: -1,
      remaining_calls: -1,
      amount_paid: 199,
    },
    {
      id: "3",
      plan_name: "pro",
      user_id: "user3",
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
      created_at: "2024-12-30T09:20:00Z",
      updated_at: "2024-12-30T09:20:00Z",
      allowed_calls: 1000,
      remaining_calls: 743,
      amount_paid: 49,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Purchases</CardTitle>
        <CardDescription>
          Latest subscription purchases and upgrades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockPurchases.slice(0, 5).map((purchase) => (
            <div key={purchase.id} className="flex items-center space-x-4">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {purchase.user_id.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium leading-none">
                    User {purchase.user_id.substring(0, 8)}
                  </p>
                  <Badge variant="outline" className="capitalize">
                    {purchase.plan_name}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(purchase.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  ${purchase.amount_paid || 0}
                </p>
                <p className="text-xs text-muted-foreground">
                  {purchase.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
