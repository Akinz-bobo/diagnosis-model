"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, FileText, Award, Clock } from "lucide-react";
import Link from "next/link";

export function ProfileOverview() {
  //   const { user, isLoading } = useCurrentUser();
  let isLoading = false;
  let user = {
    id: "1",
    image: "https://placeholder.png",
    email: "user@example.com",
    full_name: "John Doe",
    role: "admin",
    emailVerified: true,
    createdAt: new Date().toISOString(),
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-4">
          <Skeleton className="h-5 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Overview</CardTitle>
          <CardDescription>Please sign in to view your profile</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="mb-4">Sign in to access your profile information</p>
          <Button asChild className="bg-teal-600 hover:bg-teal-700">
            <Link href="/signin">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
        <CardDescription>Your account summary and statistics</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-teal-100 p-2 rounded-full text-teal-700">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Member Since</p>
              <p className="text-sm text-muted-foreground">January 2023</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-full text-blue-700">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Diagnoses</p>
              <p className="text-sm text-muted-foreground">
                12 total diagnoses
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-amber-100 p-2 rounded-full text-amber-700">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Subscription</p>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge
                  variant="outline"
                  className="bg-teal-50 text-teal-700 hover:bg-teal-50"
                >
                  Professional
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-purple-100 p-2 rounded-full text-purple-700">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Last Activity</p>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full">
          <Link href="/profile/settings">Manage Settings</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
