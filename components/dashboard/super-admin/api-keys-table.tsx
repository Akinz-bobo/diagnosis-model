"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Check,
  X,
  Copy,
  RefreshCw,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export function SuperAdminApiKeysTable() {
  const { toast } = useToast();
  const [isDeleteKeyDialogOpen, setIsDeleteKeyDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<any>(null);

  // Mock data
  const apiKeys = [
    {
      id: "1",
      name: "Production API Key",
      key: "evet_prod_1a2b3c4d5e6f7g8h9i0j",
      status: "active",
      user: "John Doe",
      organization: "Vet Clinic A",
      created: "2023-10-15",
      lastUsed: "2023-12-01",
    },
    {
      id: "2",
      name: "Development API Key",
      key: "evet_dev_2b3c4d5e6f7g8h9i0j1k",
      status: "suspended",
      user: "Jane Smith",
      organization: "Vet Clinic B",
      created: "2023-09-20",
      lastUsed: "2023-11-15",
    },
    {
      id: "3",
      name: "Testing API Key",
      key: "evet_test_3c4d5e6f7g8h9i0j1k2l",
      status: "active",
      user: "Bob Johnson",
      organization: "Vet Clinic C",
      created: "2023-11-05",
      lastUsed: "2023-12-02",
    },
    {
      id: "4",
      name: "Production API Key",
      key: "evet_prod_4d5e6f7g8h9i0j1k2l3m",
      status: "active",
      user: "Alice Williams",
      organization: "Vet Clinic A",
      created: "2023-08-12",
      lastUsed: "2023-12-03",
    },
    {
      id: "5",
      name: "Development API Key",
      key: "evet_dev_5e6f7g8h9i0j1k2l3m4n",
      status: "pending",
      user: "Charlie Brown",
      organization: "Vet Clinic D",
      created: "2023-12-01",
      lastUsed: "Never",
    },
  ];

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "user",
      header: "User",
    },
    {
      accessorKey: "organization",
      header: "Organization",
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
      accessorKey: "created",
      header: "Created",
    },
    {
      accessorKey: "lastUsed",
      header: "Last Used",
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const apiKey = row.original;
        const status = apiKey.status;

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
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(apiKey.key);
                  toast({
                    title: "API key copied",
                    description:
                      "The API key has been copied to your clipboard.",
                  });
                }}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy
              </DropdownMenuItem>
              {status === "active" ? (
                <DropdownMenuItem
                  onClick={() => {
                    toast({
                      title: "API key suspended",
                      description: `${apiKey.name} has been suspended.`,
                    });
                  }}
                  className="text-amber-600"
                >
                  <X className="mr-2 h-4 w-4" /> Suspend
                </DropdownMenuItem>
              ) : status === "suspended" ? (
                <DropdownMenuItem
                  onClick={() => {
                    toast({
                      title: "API key reactivated",
                      description: `${apiKey.name} has been reactivated.`,
                    });
                  }}
                  className="text-green-600"
                >
                  <Check className="mr-2 h-4 w-4" /> Reactivate
                </DropdownMenuItem>
              ) : status === "pending" ? (
                <>
                  <DropdownMenuItem
                    onClick={() => {
                      toast({
                        title: "API key approved",
                        description: `${apiKey.name} has been approved.`,
                      });
                    }}
                    className="text-green-600"
                  >
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      toast({
                        title: "API key rejected",
                        description: `${apiKey.name} has been rejected.`,
                      });
                    }}
                    className="text-red-600"
                  >
                    <X className="mr-2 h-4 w-4" /> Reject
                  </DropdownMenuItem>
                </>
              ) : null}
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "API key regenerated",
                    description: `${apiKey.name} has been regenerated.`,
                  });
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedKey(apiKey);
                  setIsDeleteKeyDialogOpen(true);
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={apiKeys}
        searchKey="name"
        searchPlaceholder="Search API keys..."
      />

      {/* Delete API Key Dialog */}
      {selectedKey && (
        <Dialog
          open={isDeleteKeyDialogOpen}
          onOpenChange={setIsDeleteKeyDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete API Key</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this API key? This action cannot
                be undone and will immediately revoke access for any
                applications using this key.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteKeyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  toast({
                    title: "API key deleted",
                    description: `${selectedKey.name} has been deleted.`,
                  });
                  setIsDeleteKeyDialogOpen(false);
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
