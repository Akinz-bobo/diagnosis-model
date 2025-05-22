import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRoleGate } from "@/components/auth/user-role-gate";
import { getCurrentUser } from "@/lib/auth";
import { Copy, Key, Plus, RefreshCw, Trash2 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/api-keys/columns";
import { ApiKeyRequestForm } from "@/components/dashboard/api-keys/request-form";
import { getApiKeys, getPendingApiKeyRequests } from "@/lib/actions/api-keys";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default async function ApiKeysPage() {
  const user = await getCurrentUser();
  const apiKeys = await getApiKeys(user?.id);
  const pendingRequests = await getPendingApiKeyRequests();

  return (
    <DashboardShell>
      <DashboardHeader
        heading="API Keys"
        text="Manage your API keys for accessing eVet services."
        breadcrumb={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "API Keys", href: "/dashboard/api-keys" },
        ]}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700">
              <Plus className="mr-2 h-4 w-4" /> Request New API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Request a New API Key</DialogTitle>
              <DialogDescription>
                Fill out this form to request a new API key for your
                application.
              </DialogDescription>
            </DialogHeader>
            <ApiKeyRequestForm />
          </DialogContent>
        </Dialog>
      </DashboardHeader>

      <UserRoleGate allowedRoles={["admin"]}>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All API Keys</TabsTrigger>
            <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {apiKeys.length > 0 ? (
              <DataTable
                columns={columns}
                data={apiKeys}
                searchKey="name"
                searchPlaceholder="Search by name..."
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <Key className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No API Keys Found</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    There are no active API keys in the system. Users can
                    request API keys from their dashboard.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length > 0 ? (
              <DataTable
                columns={columns}
                data={pendingRequests}
                searchKey="name"
                searchPlaceholder="Search by name..."
              />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                  <Key className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Pending Requests</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    There are no pending API key requests at this time.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </UserRoleGate>

      <UserRoleGate allowedRoles={["user"]}>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                API keys allow you to authenticate with the eVet API
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apiKeys.length > 0 ? (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div key={apiKey.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{apiKey.name}</span>
                          <Badge
                            variant={
                              apiKey.status === "active"
                                ? "default"
                                : "destructive"
                            }
                            className="capitalize"
                          >
                            {apiKey.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <code className="rounded bg-muted px-2 py-1 text-sm">
                          {apiKey.key?.substring(0, 8)}...
                          {apiKey.key?.substring((apiKey.key?.length || 0) - 4)}
                        </code>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Created on {apiKey.created} • Last used{" "}
                        {apiKey.lastUsed} • {apiKey.usageCount} API calls
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Key className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No API Keys</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You don't have any API keys yet. Request one to get started.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    <Plus className="mr-2 h-4 w-4" /> Request New API Key
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Request a New API Key</DialogTitle>
                    <DialogDescription>
                      Fill out this form to request a new API key for your
                      application.
                    </DialogDescription>
                  </DialogHeader>
                  <ApiKeyRequestForm />
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
              <CardDescription>
                API key requests awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div key={request.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Key className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{request.name}</span>
                          <Badge variant="secondary" className="capitalize">
                            {request.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Requested on {request.created}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Key className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Pending Requests</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    You don't have any pending API key requests.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </UserRoleGate>
    </DashboardShell>
  );
}
