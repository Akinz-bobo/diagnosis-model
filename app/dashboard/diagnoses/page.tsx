import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/diagnoses/columns";
import { getDiagnoses } from "@/lib/actions/diagnoses";
import { getCurrentUser } from "@/lib/auth";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function DiagnosesPage() {
  const user = await getCurrentUser();
  const diagnoses = await getDiagnoses(user?.id);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Diagnoses"
        text="View and manage your diagnostic results."
        breadcrumb={[
          { title: "Dashboard", href: "/dashboard" },
          { title: "Diagnoses", href: "/dashboard/diagnoses" },
        ]}
      >
        <Button asChild className="bg-teal-600 hover:bg-teal-700">
          <Link href="/diagnosis">
            <Plus className="mr-2 h-4 w-4" /> New Diagnosis
          </Link>
        </Button>
      </DashboardHeader>

      <DataTable
        columns={columns}
        data={diagnoses}
        searchKey="disease"
        searchPlaceholder="Search by disease..."
      />
    </DashboardShell>
  );
}
