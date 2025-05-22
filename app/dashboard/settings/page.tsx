import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/dashboard/settings/profile-form";
import { SecurityForm } from "@/components/dashboard/settings/security-form";
import { NotificationsForm } from "@/components/dashboard/settings/notifications-form";
import { AppearanceForm } from "@/components/dashboard/settings/appearance-form";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your account settings and preferences."
      >
        <Breadcrumb
          segments={[
            { title: "Dashboard", href: "/dashboard" },
            { title: "Settings", href: "/dashboard/settings" },
          ]}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/settings" isCurrentPage>
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </DashboardHeader>
      <div className="space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          <div className="mt-6">
            <TabsContent value="profile" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Profile</h3>
                <p className="text-sm text-muted-foreground">
                  This is how others will see you on the site.
                </p>
              </div>
              <Separator />
              <ProfileForm user={user} />
            </TabsContent>
            <TabsContent value="security" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Update your password and manage your account security.
                </p>
              </div>
              <Separator />
              <SecurityForm user={user} />
            </TabsContent>
            <TabsContent value="notifications" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Configure how you receive notifications.
                </p>
              </div>
              <Separator />
              <NotificationsForm user={user} />
            </TabsContent>
            <TabsContent value="appearance" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  Customize the appearance of the app.
                </p>
              </div>
              <Separator />
              <AppearanceForm user={user} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardShell>
  );
}
