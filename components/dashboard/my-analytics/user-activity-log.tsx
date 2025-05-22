"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export function UserActivityLog() {
  // Mock data - in a real app, this would come from your API
  const activities = [
    {
      id: 1,
      endpoint: "/api/diagnose",
      method: "POST",
      status: 200,
      timestamp: "2025-05-15T08:45:23Z",
      duration: 235,
    },
    {
      id: 2,
      endpoint: "/api/auth/verify",
      method: "GET",
      status: 200,
      timestamp: "2025-05-15T08:44:12Z",
      duration: 124,
    },
    {
      id: 3,
      endpoint: "/api/diagnose",
      method: "POST",
      status: 200,
      timestamp: "2025-05-15T07:32:45Z",
      duration: 312,
    },
    {
      id: 4,
      endpoint: "/api/user/profile",
      method: "GET",
      status: 200,
      timestamp: "2025-05-15T07:30:18Z",
      duration: 98,
    },
    {
      id: 5,
      endpoint: "/api/diagnose",
      method: "POST",
      status: 400,
      timestamp: "2025-05-14T16:22:33Z",
      duration: 187,
      error: "Invalid input parameters",
    },
    {
      id: 6,
      endpoint: "/api/diagnose",
      method: "POST",
      status: 200,
      timestamp: "2025-05-14T14:15:42Z",
      duration: 267,
    },
    {
      id: 7,
      endpoint: "/api/auth/verify",
      method: "GET",
      status: 200,
      timestamp: "2025-05-14T14:14:36Z",
      duration: 112,
    },
    {
      id: 8,
      endpoint: "/api/file/upload",
      method: "POST",
      status: 200,
      timestamp: "2025-05-14T11:08:19Z",
      duration: 543,
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start justify-between border-b pb-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    activity.status >= 200 && activity.status < 300
                      ? "default"
                      : "destructive"
                  }
                >
                  {activity.method}
                </Badge>
                <span className="font-mono text-sm">{activity.endpoint}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(activity.timestamp)}
              </div>
              {activity.error && (
                <div className="text-sm text-red-500 mt-1">
                  Error: {activity.error}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{activity.status}</div>
              <div className="text-xs text-muted-foreground">
                {activity.duration}ms
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
