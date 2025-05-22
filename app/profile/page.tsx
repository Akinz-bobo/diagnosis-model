import type { Metadata } from "next";
import { ProfileHeader } from "@/components/profile/profile-header";
import { ProfileOverview } from "@/components/profile/profile-overview";
import { DiagnosisHistory } from "@/components/profile/diagnosis-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/profile-form";
import { OrganizationRequestForm } from "@/components/profile/organization-request-form";

export const metadata: Metadata = {
  title: "Profile | eVet",
  description: "Manage your profile and account settings",
};

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6">
      <ProfileHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-1">
          <ProfileOverview />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="diagnoses" className="w-full">
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
              <TabsTrigger value="diagnoses">Diagnoses</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
            </TabsList>

            <TabsContent value="diagnoses" className="space-y-6">
              <DiagnosisHistory />
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and how others see you on
                    the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="organization">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Request</CardTitle>
                  <CardDescription>
                    Request to register your veterinary practice as an
                    organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrganizationRequestForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
