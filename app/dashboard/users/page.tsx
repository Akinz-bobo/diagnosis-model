import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/users/columns";
import { getUsers } from "@/lib/actions/users";
import { UserRoleGate } from "@/components/auth/user-role-gate";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Plus } from "lucide-react";

export default async function UsersPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  const users = await getUsers();

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
        <DataTable
          columns={columns}
          data={users}
          searchKey="email"
          searchPlaceholder="Search by email..."
        />
      </UserRoleGate>
    </DashboardShell>
  );
}
