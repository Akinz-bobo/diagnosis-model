"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Check,
  X,
  Copy,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ApiKey } from "@/lib/types";
import { performApiKeyAction } from "@/lib/actions/api-keys";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export const columns: ColumnDef<ApiKey>[] = [
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
    accessorKey: "key",
    header: "API Key",
    cell: ({ row }) => {
      const [isVisible, setIsVisible] = useState(false);
      const apiKey = row.getValue("key") as string;
      const { toast } = useToast();

      const copyToClipboard = () => {
        if (apiKey) {
          navigator.clipboard.writeText(apiKey);
          toast({
            title: "API key copied",
            description: "The API key has been copied to your clipboard.",
          });
        }
      };

      if (!apiKey) {
        return <span className="text-muted-foreground">Not generated</span>;
      }

      return (
        <div className="flex items-center space-x-2">
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {isVisible ? apiKey : `${apiKey.substring(0, 8)}${"•".repeat(24)}`}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(!isVisible)}
            className="h-8 w-8 p-0"
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      return (
        <Badge
          variant={
            status === "active"
              ? "default"
              : status === "suspended"
              ? "destructive"
              : "secondary"
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
    accessorKey: "usageCount",
    header: "Usage",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const apiKey = row.original;
      const status = apiKey.status;
      const { toast } = useToast();
      const [isLoading, setIsLoading] = useState(false);
      const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
      const [confirmAction, setConfirmAction] = useState<string | null>(null);

      const handleAction = async (action: string) => {
        if (
          ["approve", "reject", "suspend", "reactivate", "delete"].includes(
            action
          )
        ) {
          setConfirmAction(action);
          setIsConfirmDialogOpen(true);
        } else if (action === "copy") {
          if (apiKey.key) {
            navigator.clipboard.writeText(apiKey.key);
            toast({
              title: "API key copied",
              description: "The API key has been copied to your clipboard.",
            });
          }
        }
      };

      const executeAction = async () => {
        if (!confirmAction) return;

        setIsLoading(true);

        try {
          const formData = new FormData();
          formData.append("id", apiKey.id);
          formData.append("action", confirmAction);

          const result = await performApiKeyAction(formData);

          if (result.success) {
            toast({
              title: "Action successful",
              description: `The API key has been ${confirmAction}ed.`,
            });
          } else {
            toast({
              title: "Error",
              description:
                result.error || `Failed to ${confirmAction} API key.`,
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "An unexpected error occurred.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
          setIsConfirmDialogOpen(false);
          setConfirmAction(null);
        }
      };

      const getActionTitle = () => {
        switch (confirmAction) {
          case "approve":
            return "Approve API Key";
          case "reject":
            return "Reject API Key Request";
          case "suspend":
            return "Suspend API Key";
          case "reactivate":
            return "Reactivate API Key";
          case "delete":
            return "Delete API Key";
          default:
            return "Confirm Action";
        }
      };

      const getActionDescription = () => {
        switch (confirmAction) {
          case "approve":
            return "Are you sure you want to approve this API key request?";
          case "reject":
            return "Are you sure you want to reject this API key request? This action cannot be undone.";
          case "suspend":
            return "Are you sure you want to suspend this API key? The key will no longer be usable until reactivated.";
          case "reactivate":
            return "Are you sure you want to reactivate this API key?";
          case "delete":
            return "Are you sure you want to delete this API key? This action cannot be undone.";
          default:
            return "Are you sure you want to perform this action?";
        }
      };

      return (
        <>
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
              <DropdownMenuItem onClick={() => handleAction("copy")}>
                <Copy className="mr-2 h-4 w-4" /> Copy
              </DropdownMenuItem>
              {status === "active" ? (
                <DropdownMenuItem
                  onClick={() => handleAction("suspend")}
                  className="text-amber-600"
                >
                  <X className="mr-2 h-4 w-4" /> Suspend
                </DropdownMenuItem>
              ) : status === "suspended" ? (
                <DropdownMenuItem
                  onClick={() => handleAction("reactivate")}
                  className="text-green-600"
                >
                  <Check className="mr-2 h-4 w-4" /> Reactivate
                </DropdownMenuItem>
              ) : status === "pending" ? (
                <>
                  <DropdownMenuItem
                    onClick={() => handleAction("approve")}
                    className="text-green-600"
                  >
                    <Check className="mr-2 h-4 w-4" /> Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAction("reject")}
                    className="text-red-600"
                  >
                    <X className="mr-2 h-4 w-4" /> Reject
                  </DropdownMenuItem>
                </>
              ) : null}
              <DropdownMenuItem onClick={() => handleAction("regenerate")}>
                <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleAction("delete")}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Confirmation Dialog */}
          <Dialog
            open={isConfirmDialogOpen}
            onOpenChange={setIsConfirmDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{getActionTitle()}</DialogTitle>
                <DialogDescription>{getActionDescription()}</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsConfirmDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={executeAction}
                  disabled={isLoading}
                  variant={
                    confirmAction === "delete" || confirmAction === "reject"
                      ? "destructive"
                      : "default"
                  }
                  className={
                    confirmAction === "approve" ||
                    confirmAction === "reactivate"
                      ? "bg-green-600 hover:bg-green-700"
                      : confirmAction === "delete" || confirmAction === "reject"
                      ? ""
                      : "bg-teal-600 hover:bg-teal-700"
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Processing...
                    </>
                  ) : (
                    confirmAction!?.charAt(0).toUpperCase() +
                    confirmAction?.slice(1)
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
