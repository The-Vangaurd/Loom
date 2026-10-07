import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { MockMember } from "@/../mocks/members";

export function useMembers() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["members"],
    queryFn: () => apiClient<MockMember[]>("/members"),
  });

  const updateMember = useMutation({
    mutationFn: async (updated: MockMember) => {
      // Optimistic simulated mutation
      return apiClient<MockMember>(`/members/${updated.id}`, {
        method: "PUT",
        body: JSON.stringify(updated),
      });
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<MockMember[]>(["members"], (old) =>
        old ? old.map((m) => (m.id === saved.id ? saved : m)) : [saved]
      );
    },
  });

  return {
    members: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    updateMember,
  };
}
