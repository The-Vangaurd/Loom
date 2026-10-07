import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { MockImportBatch } from "@/../mocks/imports";

export function useImports() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["imports"],
    queryFn: () => apiClient<MockImportBatch[]>("/imports"),
  });

  const rollbackImport = useMutation({
    mutationFn: async (batchId: string) => {
      return apiClient(`/imports/${batchId}/rollback`, { method: "POST" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["imports"] });
    },
  });

  return {
    batches: query.data || [],
    isLoading: query.isLoading,
    rollbackImport,
  };
}
