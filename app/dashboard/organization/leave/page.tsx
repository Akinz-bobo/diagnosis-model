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
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function LeaveOrganizationPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Leave Organization"
        text="Confirm that you want to leave your organization."
        breadcrumb={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Organization", href: "/dashboard/organization" },
          { title: "Leave", href: "/dashboard/organization/leave" },
        ]}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <CardTitle>Leave Organization</CardTitle>
          </div>
          <CardDescription>
            Please confirm that you want to leave your organization. This action
            cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>When you leave an organization:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You will lose access to all organization resources</li>
              <li>
                Your API keys associated with this organization will be revoked
              </li>
              <li>
                You will no longer be able to view or manage organization data
              </li>
              <li>
                If you are the last admin, you cannot leave without transferring
                ownership
              </li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/dashboard/organization">
            <Button variant="outline">Cancel</Button>
          </Link>
          <form action="/api/organization/leave" method="POST">
            <input type="hidden" name="confirm" value="true" />
            <Button variant="destructive" type="submit">
              Confirm Leave
            </Button>
          </form>
        </CardFooter>
      </Card>
    </DashboardShell>
  );
}
