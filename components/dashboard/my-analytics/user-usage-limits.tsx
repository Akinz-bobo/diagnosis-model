"use client";

import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function UserUsageLimits() {
  // Mock data - in a real app, this would come from your API
  const limits = [
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
  ];

  return (
    <div className="space-y-6">
      {limits.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">{item.name}</span>
            <span className="text-sm text-muted-foreground">
              {item.used} / {item.limit} {item.unit}
            </span>
          </div>
          <Progress value={(item.used / item.limit) * 100} className="h-2" />
        </div>
      ))}

      <div className="pt-4 border-t">
        <div className="text-sm text-muted-foreground mb-4">
          You are currently on the <span className="font-medium">Free</span>{" "}
          plan. Upgrade to increase your usage limits.
        </div>
        <Button asChild className="w-full">
          <Link href="/dashboard/subscription">Upgrade Plan</Link>
        </Button>
      </div>
    </div>
  );
}
