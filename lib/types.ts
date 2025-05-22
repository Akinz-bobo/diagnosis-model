export interface User {
  id: string;
  image: string;
  email: string;
  full_name: string;
  role: string;
  emailVerified: boolean;
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
  disease: string;
  confidence: number;
  date: string;
  species: string;
  background?: string;
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
