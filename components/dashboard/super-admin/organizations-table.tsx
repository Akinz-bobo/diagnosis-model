"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, Building, Users } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function SuperAdminOrganizationsTable() {
  const { toast } = useToast();
  const [isAddOrgDialogOpen, setIsAddOrgDialogOpen] = useState(false);
  const [isEditOrgDialogOpen, setIsEditOrgDialogOpen] = useState(false);
  const [isDeleteOrgDialogOpen, setIsDeleteOrgDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);

  // Mock data
  const organizations = [
    {
      id: "1",
      name: "Vet Clinic A",
      email: "contact@vetclinica.com",
      members: 12,
      plan: "enterprise",
      status: "active",
      created: "2023-01-15",
    },
    {
      id: "2",
      name: "Vet Clinic B",
      email: "info@vetclinicb.com",
      members: 8,
      plan: "pro",
      status: "active",
      created: "2023-02-20",
    },
    {
      id: "3",
      name: "Vet Clinic C",
      email: "support@vetclinicc.com",
      members: 5,
      plan: "free",
      status: "inactive",
      created: "2023-03-10",
    },
    {
      id: "4",
      name: "Vet Clinic D",
      email: "hello@vetclinicd.com",
      members: 3,
      plan: "pro",
      status: "active",
      created: "2023-04-05",
    },
    {
      id: "5",
      name: "Vet Clinic E",
      email: "admin@vetclinice.com",
      members: 7,
      plan: "free",
      status: "active",
      created: "2023-05-12",
    },
  ];

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "members",
      header: "Members",
    },
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
      accessorKey: "created",
      header: "Created",
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const org = row.original;

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
                  setSelectedOrg(org);
                  setIsEditOrgDialogOpen(true);
                }}
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Organization
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast({
                    title: "View Members",
                    description: `Viewing ${org.members} members of ${org.name}.`,
                  });
                }}
              >
                <Users className="mr-2 h-4 w-4" /> View Members
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedOrg(org);
                  setIsDeleteOrgDialogOpen(true);
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
      <div className="flex justify-end">
        <Button
          onClick={() => setIsAddOrgDialogOpen(true)}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Building className="mr-2 h-4 w-4" /> Add Organization
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={organizations}
        searchKey="name"
        searchPlaceholder="Search organizations..."
      />

      {/* Add Organization Dialog */}
      <Dialog open={isAddOrgDialogOpen} onOpenChange={setIsAddOrgDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Organization</DialogTitle>
            <DialogDescription>
              Add a new organization to the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Vet Clinic Name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                placeholder="contact@example.com"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                placeholder="123 Main St, City, Country"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                placeholder="+1 (555) 123-4567"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddOrgDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-700"
              onClick={() => {
                toast({
                  title: "Organization added",
                  description:
                    "The new organization has been added successfully.",
                });
                setIsAddOrgDialogOpen(false);
              }}
            >
              Add Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Organization Dialog */}
      {selectedOrg && (
        <Dialog
          open={isEditOrgDialogOpen}
          onOpenChange={setIsEditOrgDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Organization</DialogTitle>
              <DialogDescription>Edit organization details.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  defaultValue={selectedOrg.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  defaultValue={selectedOrg.email}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-plan" className="text-right">
                  Plan
                </Label>
                <Input
                  id="edit-plan"
                  defaultValue={selectedOrg.plan}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Input
                  id="edit-status"
                  defaultValue={selectedOrg.status}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditOrgDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                onClick={() => {
                  toast({
                    title: "Organization updated",
                    description: `${selectedOrg.name}'s details have been updated.`,
                  });
                  setIsEditOrgDialogOpen(false);
                }}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Organization Dialog */}
      {selectedOrg && (
        <Dialog
          open={isDeleteOrgDialogOpen}
          onOpenChange={setIsDeleteOrgDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Organization</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedOrg.name}? This action
                cannot be undone and will affect all members of this
                organization.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteOrgDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  toast({
                    title: "Organization deleted",
                    description: `${selectedOrg.name} has been deleted.`,
                  });
                  setIsDeleteOrgDialogOpen(false);
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
