import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCurrentUser, updateUser, UserProfile } from "@/lib/api/user";

export function useCurrentUserQuery() {
  return useQuery<UserProfile, Error>({
    queryKey: ["user", "current"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation<
    UserProfile,
    Error,
    { userId: string; data: Partial<UserProfile> & { image_file?: File } }
  >({
    mutationFn: ({ userId, data }) => updateUser(userId, data),
    onSuccess: (updatedUser) => {
      // Invalidate and refetch user data everywhere
      queryClient.setQueryData(["user", "current"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["user", "current"] });
    },
  });
}
