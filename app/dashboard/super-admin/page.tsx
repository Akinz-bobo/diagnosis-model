import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ApiUsageChart } from "@/components/dashboard/api-usage-chart";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, Check, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function SuperAdminPage() {
  const user = await getCurrentUser();

  // Only allow super admin access
  if (!user || user.role !== "admin") {
    redirect("/dashboard");
  }

  // Mock data for users
  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "admin",
      status: "active",
      organization: "Vet Clinic A",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "user",
      status: "active",
      organization: "Vet Clinic B",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "user",
      status: "inactive",
      organization: "Vet Clinic C",
    },
  ];

  // Mock data for organizations
  const organizations = [
    {
      id: "1",
      name: "Vet Clinic A",
      email: "contact@vetclinica.com",
      members: 12,
      plan: "enterprise",
      status: "active",
    },
    {
      id: "2",
      name: "Vet Clinic B",
      email: "info@vetclinicb.com",
      members: 8,
      plan: "pro",
      status: "active",
    },
    {
      id: "3",
      name: "Vet Clinic C",
      email: "support@vetclinicc.com",
      members: 5,
      plan: "free",
      status: "inactive",
    },
  ];

  // Mock data for API keys
  const apiKeys = [
    {
      id: "1",
      name: "Production API Key",
      key: "evet_prod_1a2b3c4d5e6f7g8h9i0j",
      status: "active",
      user: "John Doe",
      organization: "Vet Clinic A",
    },
    {
      id: "2",
      name: "Development API Key",
      key: "evet_dev_2b3c4d5e6f7g8h9i0j1k",
      status: "suspended",
      user: "Jane Smith",
      organization: "Vet Clinic B",
    },
    {
      id: "3",
      name: "Testing API Key",
      key: "evet_test_3c4d5e6f7g8h9i0j1k2l",
      status: "active",
      user: "Bob Johnson",
      organization: "Vet Clinic C",
    },
  ];

  // Column definitions for users table
  const userColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }: any) => {
        const role = row.getValue("role");
        return (
          <Badge variant={role === "admin" ? "default" : "outline"}>
            {role}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant={
              status === "active"
                ? "success"
                : status === "inactive"
                ? "destructive"
                : "secondary"
            }
          >
            {status}
          </Badge>
        );
      },
    },
    { accessorKey: "organization", header: "Organization" },
    {
      id: "actions",
      cell: ({ row }: any) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" /> Edit User
              </DropdownMenuItem>
              <DropdownMenuItem>
                {row.getValue("status") === "active" ? (
                  <>
                    <X className="mr-2 h-4 w-4" /> Deactivate
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Column definitions for organizations table
  const organizationColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "members", header: "Members" },
    {
      accessorKey: "plan",
      header: "Plan",
      cell: ({ row }: any) => {
        const plan = row.getValue("plan");
        return (
          <Badge
            variant={
              plan === "enterprise"
                ? "default"
                : plan === "pro"
                ? "secondary"
                : "outline"
            }
          >
            {plan}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <Badge variant={status === "active" ? "success" : "destructive"}>
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" /> Edit Organization
              </DropdownMenuItem>
              <DropdownMenuItem>View Members</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Column definitions for API keys table
  const apiKeyColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "user", header: "User" },
    { accessorKey: "organization", header: "Organization" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <Badge
            variant={
              status === "active"
                ? "success"
                : status === "suspended"
                ? "destructive"
                : status === "pending"
                ? "secondary"
                : "outline"
            }
            className="capitalize"
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const status = row.getValue("status");
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {status === "active" ? (
                <DropdownMenuItem className="text-amber-600">
                  <X className="mr-2 h-4 w-4" /> Suspend
                </DropdownMenuItem>
              ) : status === "suspended" ? (
                <DropdownMenuItem className="text-green-600">
                  <Check className="mr-2 h-4 w-4" /> Reactivate
                </DropdownMenuItem>
              ) : status === "pending" ? (
                <>
                  <DropdownMenuItem className="text-green-600">
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <X className="mr-2 h-4 w-4" /> Reject
                  </DropdownMenuItem>
                </>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Super Admin Dashboard"
        text="Manage all aspects of the eVet platform."
        breadcrumb={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Super Admin", href: "/dashboard/super-admin" },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">
              +18 new users this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organizations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">
              +3 new organizations this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +12 new keys this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Platform Usage</CardTitle>
          <CardDescription>
            API usage across the platform over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiUsageChart detailed />
        </CardContent>
      </Card>

      <Tabs defaultValue="users" className="space-y-4 mt-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="organizations">Organizations</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage all users across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={userColumns}
                data={users}
                searchKey="name"
                searchPlaceholder="Search users..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Management</CardTitle>
              <CardDescription>
                Manage all organizations across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={organizationColumns}
                data={organizations}
                searchKey="name"
                searchPlaceholder="Search organizations..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Key Management</CardTitle>
              <CardDescription>
                Manage all API keys across the platform.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={apiKeyColumns}
                data={apiKeys}
                searchKey="name"
                searchPlaceholder="Search API keys..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
