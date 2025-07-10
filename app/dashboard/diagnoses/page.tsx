"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "@/components/dashboard/diagnoses/columns";
import { getDiagnoses, getAllDiagnosesAdmin } from "@/lib/actions/diagnoses";
import type { DiagnosisResult } from "@/lib/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCurrentUserQuery } from "@/hooks/use-user";

export default function DiagnosesPage() {
  const user = useCurrentUserQuery();
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDiagnoses() {
      setLoading(true);
      setError("");
      try {
        let data: DiagnosisResult[] = [];
        if (user.data?.role === "admin") {
          data = await getAllDiagnosesAdmin();
        } else if (user.data?.id) {
          data = await getDiagnoses(user.data.id);
        }
        setDiagnoses(data);
      } catch (err) {
        setError("Failed to load diagnoses");
      } finally {
        setLoading(false);
      }
    }
    if (user.data) fetchDiagnoses();
  }, [user.data]);

  console.log("Diagnoses data:", diagnoses);
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
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">
          Loading diagnoses...
        </div>
      ) : error ? (
        <div className="p-8 text-center text-destructive">{error}</div>
      ) : (
        <DataTable columns={columns} data={diagnoses} searchKey="disease" />
      )}
    </DashboardShell>
  );
}
