"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";

interface ProfileHeaderProps {
  activeTab?: string;
}

export function ProfileHeader({ activeTab = "profile" }: ProfileHeaderProps) {
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>({
    id: "1",
    image: "https://placeholder.png",
    email: "user@example.com",
    full_name: "John Doe",
    role: "admin",
    emailVerified: true,
    createdAt: new Date().toISOString(),
  });
  // useEffect(() => {
  //   getCurrentUser()
  //     .then((user) => {
  //       setUser(user);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, []);
  const pathname = usePathname();

  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const getUserRole = () => {
    if (!user) return null;
    if (user.role === "SUPER_ADMIN") return "Super Admin";
    if (user.role === "ADMIN") return "Admin";
    if (user.role === "ORGANIZATION") return "Organization";
    return "User";
  };

  if (isLoading) {
    return (
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>Please sign in to view your profile</p>
        <Button asChild className="mt-4 bg-teal-600 hover:bg-teal-700">
          <Link href="/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
          <AvatarImage src={user.image || ""} alt={user.full_name || "User"} />
          <AvatarFallback className="text-2xl bg-teal-100 text-teal-800">
            {getInitials(user.full_name || "")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.full_name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {getUserRole() && (
            <p className="text-sm font-medium text-teal-600 mt-1">
              {getUserRole()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
