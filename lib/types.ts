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
  created_at: string;
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

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: "monthly" | "yearly";
  features: {
    team_allowed: string;
    api_keys_allowed: string;
    real_time_api_usage_tracking: boolean;
    developer_support: boolean;
    support_level: string;
    unlimited_diagnosis: boolean;
    unlimited_api_calls: boolean;
    analytics_dashboard: boolean;
    priority_queue: boolean;
  };
  allowed_calls: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  plan_name: string;
  user_id: string;
  organization_id?: string;
  features: {
    team_allowed: string;
    api_keys_allowed: string;
    real_time_api_usage_tracking: boolean;
    developer_support: boolean;
    support_level: string;
    unlimited_diagnosis: boolean;
    unlimited_api_calls: boolean;
    analytics_dashboard: boolean;
    priority_queue: boolean;
  };
  status: "active" | "cancelled" | "expired" | "pending";
  created_at: string;
  updated_at: string;
  allowed_calls: number;
  remaining_calls: number;
  expires_at?: string;
  next_billing_date?: string;
  amount_paid?: number;
}

export interface SubscriptionStats {
  total_subscriptions: number;
  active_subscriptions: number;
  expired_subscriptions: number;
  cancelled_subscriptions: number;
  recurring_revenue: number;
  plan_distribution: Record<string, number>;
  recent_purchases: UserSubscription[];
}
