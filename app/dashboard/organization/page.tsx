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
import { OrganizationForm } from "@/components/dashboard/organization/organization-form";
import { getCurrentUser } from "@/lib/auth";
import {
  Building,
  Users,
  MapPin,
  Phone,
  Mail,
  Globe,
  Plus,
  Edit,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRoleGate } from "@/components/auth/user-role-gate";
import { getOrganization } from "@/lib/actions/organizations";
import { MemberInviteForm } from "@/components/dashboard/organization/member-invite-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export default async function OrganizationPage() {
  const user = await getCurrentUser();
  const organization = await getOrganization(user?.id || "");

  const hasOrganization = !!organization;

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Organization"
        text="Manage your organization details and members."
        breadcrumb={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Organization", href: "/dashboard/organization" },
        ]}
      />

      {hasOrganization ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                View and manage your organization information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">{organization.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {organization.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{organization.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{organization.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{organization.email}</span>
                    </div>
                    {organization.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>{organization.website}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" /> Members
                      </h4>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="h-3 w-3 mr-1" /> Invite
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invite Team Member</DialogTitle>
                            <DialogDescription>
                              Invite a new member to join your organization.
                            </DialogDescription>
                          </DialogHeader>
                          <MemberInviteForm organizationId={organization.id} />
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="space-y-4">
                      {organization.members.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-teal-100 text-teal-800">
                                {member.name.substring(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">
                                {member.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {member.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-xs font-medium">
                            {member.role}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link href="/dashboard/organization/leave">
                <Button variant="outline">Leave Organization</Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-teal-600 hover:bg-teal-700">
                    <Edit className="mr-2 h-4 w-4" /> Edit Organization
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Edit Organization</DialogTitle>
                    <DialogDescription>
                      Update your organization details.
                    </DialogDescription>
                  </DialogHeader>
                  <OrganizationForm organization={organization} isEditing />
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>

          <UserRoleGate allowedRoles={["admin"]}>
            <Card>
              <CardHeader>
                <CardTitle>API Usage & Limits</CardTitle>
                <CardDescription>
                  View your organization's API usage and limits
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg border p-4">
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Monthly API Calls
                      </div>
                      <div className="text-2xl font-bold">1,245 / 5,000</div>
                      <div className="w-full h-2 bg-slate-100 rounded-full mt-2">
                        <div
                          className="h-2 bg-teal-600 rounded-full"
                          style={{ width: "25%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Diagnoses
                      </div>
                      <div className="text-2xl font-bold">87 / 200</div>
                      <div className="w-full h-2 bg-slate-100 rounded-full mt-2">
                        <div
                          className="h-2 bg-teal-600 rounded-full"
                          style={{ width: "43%" }}
                        ></div>
                      </div>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Storage
                      </div>
                      <div className="text-2xl font-bold">1.2 GB / 5 GB</div>
                      <div className="w-full h-2 bg-slate-100 rounded-full mt-2">
                        <div
                          className="h-2 bg-teal-600 rounded-full"
                          style={{ width: "24%" }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-2">Plan Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current Plan
                        </p>
                        <p className="font-medium">Business</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Renewal Date
                        </p>
                        <p className="font-medium">January 15, 2024</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Billing Cycle
                        </p>
                        <p className="font-medium">Monthly</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Payment Method
                        </p>
                        <p className="font-medium">Visa ending in 4242</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/dashboard/subscription" className="w-full">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    Upgrade Plan
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </UserRoleGate>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Register Organization</CardTitle>
            <CardDescription>
              Register your organization to manage team members and API access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 mb-8">
              <div className="text-center">
                <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">
                  No Organization Registered
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Register your organization to collaborate with team members,
                  manage API keys, and access advanced features.
                </p>
              </div>
            </div>

            <Separator className="my-6" />

            <OrganizationForm />
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  );
}
