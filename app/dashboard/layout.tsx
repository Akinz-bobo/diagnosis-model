import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/sidebar";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar user={user} />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
