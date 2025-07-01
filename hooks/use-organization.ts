import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrganizations,
  createOrganization,
  fetchOrganizationById,
  updateOrganization,
  Organization,
} from "@/lib/api/organization";

// Fetch all organizations
export function useOrganizationsQuery() {
  return useQuery<Organization[], Error>({
    queryKey: ["organizations"],
    queryFn: fetchOrganizations,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// Fetch a single organization by ID
export function useOrganizationQuery(orgId: string) {
  return useQuery<Organization, Error>({
    queryKey: ["organization", orgId],
    queryFn: () => fetchOrganizationById(orgId),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// Create organization
export function useCreateOrganizationMutation() {
  const queryClient = useQueryClient();
  return useMutation<Organization, Error, Omit<Organization, "id" | "created_at" | "updated_at" | "team">>({
    mutationFn: (data) => createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}

// Update organization
export function useUpdateOrganizationMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    Organization,
    Error,
    { orgId: string; data: Partial<Omit<Organization, "id" | "created_at" | "updated_at" | "team">> }
  >({
    mutationFn: ({ orgId, data }) => updateOrganization(orgId, data),
    onSuccess: (updatedOrg) => {
      queryClient.setQueryData(["organization", updatedOrg.id], updatedOrg);
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });
}
