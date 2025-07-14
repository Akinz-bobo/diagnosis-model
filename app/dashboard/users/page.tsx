"use client";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/users/columns";
import { UserRoleGate } from "@/components/auth/user-role-gate";
import { Plus, Users, UserCheck, UserX } from "lucide-react";
import { useAllUsersQuery } from "@/hooks/use-user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  const { data: users, isLoading, isError, error } = useAllUsersQuery();

  // Memoize columns to avoid unnecessary re-renders
  const memoizedColumns = useMemo(() => columns, []);

  // Calculate user statistics
  const userStats = useMemo(() => {
    if (!users) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
      };
    }

    const activeUsers = users.filter(user => user.status === 'active').length;
    const totalUsers = users.length;
    const inactiveUsers = totalUsers - activeUsers;

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
    };
  }, [users]);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="User Management"
        text="Manage user accounts and permissions."
        breadcrumb={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Users", href: "/dashboard/users" },
        ]}
      >
        <Button className="bg-teal-600 hover:bg-teal-700">
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </DashboardHeader>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {isLoading ? "..." : userStats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {isLoading ? "..." : userStats.activeUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {isLoading ? "..." : userStats.inactiveUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              Inactive or suspended accounts
            </p>
          </CardContent>
        </Card>
      </div>

      <UserRoleGate allowedRoles={["admin"]}>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading users...
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-600">
            {error?.message || "Failed to load users."}
          </div>
        ) : (
          <DataTable
            columns={memoizedColumns}
            data={users || []}
            searchKey="email"
          />
        )}
      </UserRoleGate>
    </DashboardShell>
  );
}
