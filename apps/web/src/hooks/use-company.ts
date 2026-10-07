import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { TenantProfile, UpdateCompanyProfileInput, UpdateModulesInput } from "@loom/shared";

export function useCompany() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["company-profile"],
    queryFn: () => apiClient<TenantProfile>("/tenants/current"),
  });

  const updateProfile = useMutation({
    mutationFn: (data: UpdateCompanyProfileInput) =>
      apiClient<TenantProfile>("/tenants/current", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["company-profile"], updated);
    },
  });

  const updateModules = useMutation({
    mutationFn: (data: UpdateModulesInput) =>
      apiClient<Record<string, boolean>>("/tenants/modules", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (updatedModules) => {
      queryClient.setQueryData(["company-profile"], (old: TenantProfile | undefined) => {
        if (!old) return old;
        return { ...old, modules: updatedModules };
      });
    },
  });

  return {
    profile: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    updateProfile,
    updateModules,
  };
}
