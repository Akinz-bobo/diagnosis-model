"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getDiagnoses } from "@/lib/actions/diagnoses";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { DiagnosisResult } from "@/lib/types";

interface UseDiagnosesState {
  diagnoses: DiagnosisResult[];
  loading: boolean;
  error: string | null;
  totalCount: number;
}

interface UseDiagnosesReturn extends UseDiagnosesState {
  refetch: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useDiagnoses(): UseDiagnosesReturn {
  const { user } = useCurrentUser();
  const [state, setState] = useState<UseDiagnosesState>({
    diagnoses: [],
    loading: true,
    error: null,
    totalCount: 0,
  });

  const fetchDiagnoses = useCallback(async () => {
    if (!user?.id) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "User not authenticated",
        diagnoses: [],
        totalCount: 0,
      }));
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const data = await getDiagnoses(user.id);

      setState({
        diagnoses: data,
        loading: false,
        error: null,
        totalCount: data.length,
      });
    } catch (error) {
      console.error("Error fetching diagnoses:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch diagnoses",
      }));
    }
  }, [user?.id]);

  // Initial fetch when user changes
  useEffect(() => {
    fetchDiagnoses();
  }, [fetchDiagnoses]);

  // Refetch function for manual refresh
  const refetch = useCallback(async () => {
    await fetchDiagnoses();
  }, [fetchDiagnoses]);

  // Alias for consistency
  const refresh = refetch;

  return {
    ...state,
    refetch,
    refresh,
  };
}

// Hook for filtered diagnoses with additional utilities
interface UseFilteredDiagnosesOptions {
  searchQuery?: string;
  filter?: string;
  sortBy?: "date" | "confidence" | "urgency";
  sortOrder?: "asc" | "desc";
}

export function useFilteredDiagnoses(
  options: UseFilteredDiagnosesOptions = {}
) {
  const { diagnoses, loading, error, refetch, refresh } = useDiagnoses();
  const {
    searchQuery = "",
    filter = "all",
    sortBy = "date",
    sortOrder = "desc",
  } = options;

  const filteredDiagnoses = useMemo(() => {
    let filtered = diagnoses.filter((diagnosis: any) => {
      // Species filter
      if (filter !== "all") {
        if (
          diagnosis.raw_history.Species?.toLowerCase() !== filter.toLowerCase()
        ) {
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          diagnosis.diagnosis.disease.toLowerCase().includes(searchLower) ||
          diagnosis.species.toLowerCase().includes(searchLower) ||
          diagnosis.clinical_context?.history_analysis?.summary
            ?.toLowerCase()
            .includes(searchLower)
        );
      }

      return true;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "date":
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          comparison = dateA - dateB;
          break;
        case "confidence":
          comparison = a.diagnosis.confidence - b.diagnosis.confidence;
          break;
        case "urgency":
          const urgencyOrder = { urgent: 3, moderate: 2, low: 1 };
          const urgencyA =
            urgencyOrder[
              a.lesion_bedrock.urgency.toLowerCase() as keyof typeof urgencyOrder
            ] || 0;
          const urgencyB =
            urgencyOrder[
              b.lesion_bedrock.urgency.toLowerCase() as keyof typeof urgencyOrder
            ] || 0;
          comparison = urgencyA - urgencyB;
          break;
      }

      return sortOrder === "desc" ? -comparison : comparison;
    });

    return filtered;
  }, [diagnoses, searchQuery, filter, sortBy, sortOrder]);

  return {
    diagnoses: filteredDiagnoses,
    allDiagnoses: diagnoses,
    loading,
    error,
    totalCount: diagnoses.length,
    filteredCount: filteredDiagnoses.length,
    refetch,
    refresh,
  };
}

// Hook for diagnosis statistics
export function useDiagnosisStats() {
  const { diagnoses, loading, error } = useDiagnoses();

  const stats = useMemo(() => {
    if (loading || diagnoses.length === 0) {
      return {
        total: 0,
        bySpecies: {},
        byUrgency: {},
        averageConfidence: 0,
        recentCount: 0,
      };
    }

    const bySpecies: Record<string, number> = {};
    const byUrgency: Record<string, number> = {};
    let totalConfidence = 0;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    let recentCount = 0;

    diagnoses.forEach((diagnosis) => {
      // Count by species
      bySpecies[diagnosis.species] = (bySpecies[diagnosis.species] || 0) + 1;

      // Count by urgency
      const urgency = diagnosis.lesion_bedrock.urgency;
      byUrgency[urgency] = (byUrgency[urgency] || 0) + 1;

      // Sum confidence for average
      totalConfidence += diagnosis.diagnosis.confidence;

      // Count recent diagnoses
      const diagnosisDate = new Date(diagnosis.created_at);
      if (diagnosisDate >= thirtyDaysAgo) {
        recentCount++;
      }
    });

    return {
      total: diagnoses.length,
      bySpecies,
      byUrgency,
      averageConfidence:
        diagnoses.length > 0 ? totalConfidence / diagnoses.length : 0,
      recentCount,
    };
  }, [diagnoses, loading]);

  return {
    stats,
    loading,
    error,
  };
}
