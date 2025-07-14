"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Check, X, Edit, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserProfile } from "@/lib/api/user";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateUserMutation, useSuspendUserMutation } from "@/hooks/use-user";

export const columns: ColumnDef<UserProfile & { emailVerified?: boolean }>[] = [
  {
    accessorKey: "full_name",
    header: "Name",
    cell: ({ row }) => row.original.full_name || row.original.email,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge
          variant={role === "admin" ? "default" : "outline"}
          className="capitalize"
        >
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "emailVerified",
    header: "Email Verified",
    cell: ({ row }) => {
      const verified = true;
      return verified ? (
        <Check className="h-5 w-5 text-green-500" />
      ) : (
        <X className="h-5 w-5 text-red-500" />
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const { toast } = useToast();
      const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
      const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);
      const [formData, setFormData] = useState({
        full_name: user.full_name,
        role: user.role,
      });
      const updateUserMutation = useUpdateUserMutation();
      const suspendUserMutation = useSuspendUserMutation();

      const handleUpdateUser = async () => {
        updateUserMutation.mutate(
          {
            userId: user.id,
            data: {
              full_name: formData.full_name,
              role: formData.role,
            },
          },
          {
            onSuccess: () => {
              toast({
                title: "User updated",
                description: "The user has been updated successfully.",
              });
              setIsEditDialogOpen(false);
            },
            onError: (error) => {
              toast({
                title: "Error",
                description: error.message || "Failed to update user.",
                variant: "destructive",
              });
            },
          }
        );
      };

      const handleSuspendUser = async () => {
        suspendUserMutation.mutate(
          { userId: user.id },
          {
            onSuccess: () => {
              toast({
                title: "User suspended",
                description: "The user account has been suspended.",
              });
              setIsSuspendDialogOpen(false);
            },
            onError: (error) => {
              toast({
                title: "Error",
                description: error.message || "Failed to suspend user.",
                variant: "destructive",
              });
            },
          }
        );
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
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsSuspendDialogOpen(true)}
                className="text-red-600"
              >
                <Ban className="mr-2 h-4 w-4" /> Suspend
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Edit User Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Make changes to the user account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateUser}
                  className="bg-teal-600 hover:bg-teal-700"
                  disabled={updateUserMutation.status === "pending"}
                >
                  {updateUserMutation.status === "pending"
                    ? "Saving..."
                    : "Save Changes"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Suspend User Dialog */}
          <Dialog
            open={isSuspendDialogOpen}
            onOpenChange={setIsSuspendDialogOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Suspend User</DialogTitle>
                <DialogDescription>
                  Are you sure you want to suspend this user? This action can be
                  undone by an admin.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsSuspendDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleSuspendUser}
                  disabled={suspendUserMutation.status === "pending"}
                >
                  {suspendUserMutation.status === "pending"
                    ? "Suspending..."
                    : "Suspend"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];
