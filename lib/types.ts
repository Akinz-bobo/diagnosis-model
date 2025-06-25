export interface User {
  id: string;
  image?: string;
  email: string;
  name: string;
  role: string;
  emailVerified?: boolean;
  createdAt?: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key?: string;
  status: string;
  created?: string;
  lastUsed?: string;
  usageCount?: number;
  user?: string;
  organization?: string;
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  reason?: string;
  members: OrganizationMember[];
}

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DiagnosisResult {
  id: string;
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
}

export interface Diagnosis {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  treatment: string;
  species: string[];
}
export interface Subscription {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string; // e.g., "monthly", "yearly"
  features: string[];
  status: string; // e.g., "active", "inactive"
}
