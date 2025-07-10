"use client";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/users/columns";
import { UserRoleGate } from "@/components/auth/user-role-gate";
import { Plus } from "lucide-react";
import { useAllUsersQuery } from "@/hooks/use-user";

export default function UsersPage() {
  const { data: users, isLoading, isError, error } = useAllUsersQuery();

  // Memoize columns to avoid unnecessary re-renders
  const memoizedColumns = useMemo(() => columns, []);

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
