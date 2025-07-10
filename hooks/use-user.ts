import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchCurrentUser,
  fetchAllUsers,
  fetchUserById,
  fetchUsersByOrganization,
  updateUser,
  suspendUser,
  promoteUserToAdmin,
  UserProfile,
} from "@/lib/api/user";

// Current user
export function useCurrentUserQuery() {
  return useQuery<UserProfile, Error>({
    queryKey: ["user", "current"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

// All users (admin only)
export function useAllUsersQuery() {
  return useQuery<UserProfile[], Error>({
    queryKey: ["users", "all"],
    queryFn: fetchAllUsers,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

// User by ID
export function useUserByIdQuery(userId: string, enabled = true) {
  return useQuery<UserProfile, Error>({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId && enabled,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

// Users by organization
export function useUsersByOrganizationQuery(orgId: string, enabled = true) {
  return useQuery<UserProfile[], Error>({
    queryKey: ["users", "organization", orgId],
    queryFn: () => fetchUsersByOrganization(orgId),
    enabled: !!orgId && enabled,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

// Update user
export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    UserProfile,
    Error,
    { userId: string; data: Partial<UserProfile> & { image_file?: File } }
  >({
    mutationFn: ({ userId, data }) => updateUser(userId, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user", "current"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
      queryClient.invalidateQueries({ queryKey: ["user", updatedUser.id] });
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      if (updatedUser.organization_id) {
        queryClient.invalidateQueries({
          queryKey: ["users", "organization", updatedUser.organization_id],
        });
      }
    },
  });
}

// Suspend user
export function useSuspendUserMutation() {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error, { userId: string }>({
    mutationFn: ({ userId }) => suspendUser(userId),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      if (user.organization_id) {
        queryClient.invalidateQueries({
          queryKey: ["users", "organization", user.organization_id],
        });
      }
    },
  });
}

// Promote user to admin
export function usePromoteUserToAdminMutation() {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, Error, { userId: string }>({
    mutationFn: ({ userId }) => promoteUserToAdmin(userId),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: ["user", user.id] });
      queryClient.invalidateQueries({ queryKey: ["users", "all"] });
      if (user.organization_id) {
        queryClient.invalidateQueries({
          queryKey: ["users", "organization", user.organization_id],
        });
      }
    },
  });
}
