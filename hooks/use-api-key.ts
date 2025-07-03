import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchApiKeys,
  createApiKey,
  fetchApiKeyById,
  updateApiKey,
  APIKeyOutFull,
  APIKeyCreate,
  APIKeyBase,
} from "@/lib/api/api-key";

// Fetch all API keys
export function useApiKeysQuery() {
  return useQuery<APIKeyOutFull[], Error>({
    queryKey: ["api-keys"],
    queryFn: fetchApiKeys,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// Fetch a single API key by ID
export function useApiKeyQuery(apiKeyId: string) {
  return useQuery<APIKeyOutFull, Error>({
    queryKey: ["api-key", apiKeyId],
    queryFn: () => fetchApiKeyById(apiKeyId),
    enabled: !!apiKeyId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// Create API key
export function useCreateApiKeyMutation() {
  const queryClient = useQueryClient();
  return useMutation<APIKeyOutFull, Error, APIKeyCreate>({
    mutationFn: (data) => createApiKey(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}

// Update API key
export function useUpdateApiKeyMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    APIKeyOutFull,
    Error,
    { apiKeyId: string; data: Partial<APIKeyBase> }
  >({
    mutationFn: ({ apiKeyId, data }) => updateApiKey(apiKeyId, data),
    onSuccess: (updatedApiKey) => {
      queryClient.setQueryData(["api-key", updatedApiKey.id], updatedApiKey);
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
  });
}
