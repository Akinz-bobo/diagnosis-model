import { getDiagnosis } from "@/lib/actions/diagnoses";
import { DiagnosisDetailClient } from "@/components/diagnosis/diagnosis-detail-client";

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
    return <p>Diagnosis not found</p>;
  }

  return <DiagnosisDetailClient diagnosis={diagnosis} />;
}
