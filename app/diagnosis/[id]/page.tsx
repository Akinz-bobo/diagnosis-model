import { getDiagnosis } from "@/lib/actions/diagnoses";
import { DiagnosisDetailClient } from "@/components/diagnosis/diagnosis-detail-client";
import { notFound } from "next/navigation";

interface DiagnosisDetailPageProps {
  params: {
    id: string;
  };
}

export default async function DiagnosisDetailPage({
  params,
}: DiagnosisDetailPageProps) {
  const diagnosis = await getDiagnosis(params.id);

  if (!diagnosis) {
    notFound();
  }

  return <DiagnosisDetailClient diagnosis={diagnosis} />;
}
