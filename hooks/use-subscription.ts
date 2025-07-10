import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchSubscriptions,
  createSubscription,
  fetchSubscriptionById,
  updateSubscription,
  Subscription,
  SubscriptionCreate,
  SubscriptionUpdate,
} from "@/lib/api/subscription";

// Fetch all subscriptions
export function useSubscriptionsQuery() {
  return useQuery<Subscription[], Error>({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// Fetch a single subscription by ID
export function useSubscriptionQuery(subscriptionId: string) {
  return useQuery<Subscription, Error>({
    queryKey: ["subscription", subscriptionId],
    queryFn: () => fetchSubscriptionById(subscriptionId),
    enabled: !!subscriptionId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// Create subscription
export function useCreateSubscriptionMutation() {
  const queryClient = useQueryClient();
  return useMutation<Subscription, Error, SubscriptionCreate>({
    mutationFn: (data) => createSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}

// Update subscription
export function useUpdateSubscriptionMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    Subscription,
    Error,
    { subscriptionId: string; data: SubscriptionUpdate }
  >({
    mutationFn: ({ subscriptionId, data }) =>
      updateSubscription(subscriptionId, data),
    onSuccess: (updatedSubscription) => {
      queryClient.setQueryData(
        ["subscription", updatedSubscription.id],
        updatedSubscription
      );
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    },
  });
}
