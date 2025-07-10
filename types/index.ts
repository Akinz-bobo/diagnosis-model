export interface DiagnosisResult {
  diagnosis: {
    disease: string;
    confidence: number;
    differential_diagnoses: string[];
  };
  clinical_context: {
    background: string;
    conclusion: string;
    mortality_rate: number;
    history_analysis: {
      clinical_consistency_score: number;
      mortality_risk_score: number;
      species_issues: string[];
      age_issues: string[];
      summary: string;
    };
  };
  image_analysis: {
    processed_images: Array<{
      url: string;
      lesions: string[];
      confidences: number[];
      relevance: Record<string, number>;
    }>;
    invalid_images: string[];
    total_lesions_identified: number;
  };
  lesion_bedrock: {
    lesion_relevance: Record<string, string>;
    differential_diagnoses: string[];
    urgency: string;
    urgency_reason: string;
  };
  suggestions: string[];
  warnings: string | null;
  date: string;
  species: string;
  user_id: string;
  id: string;
}
