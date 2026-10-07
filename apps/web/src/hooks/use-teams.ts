import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { TreeNode } from "@/components/erp/tree-view";
import { OrgUnitNode, CreateOrgUnitInput, MoveOrgUnitInput } from "@loom/shared";

function mapOrgUnitToTreeNode(node: OrgUnitNode): TreeNode {
  return {
    id: node.id,
    name: node.name,
    type: node.parentId ? "team" : "unit",
    count: node.memberCount ?? 0,
    children: node.children ? node.children.map(mapOrgUnitToTreeNode) : [],
  };
}

export function useTeams() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["org-units"],
    queryFn: async () => {
      const raw = await apiClient<OrgUnitNode[]>("/org-units");
      return raw.map(mapOrgUnitToTreeNode);
    },
  });

  const createTeam = useMutation({
    mutationFn: (data: CreateOrgUnitInput) =>
      apiClient<OrgUnitNode>("/org-units", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-units"] });
    },
  });

  const moveTeam = useMutation({
    mutationFn: ({ unitId, newParentId }: { unitId: string; newParentId: string }) =>
      apiClient<{ success: boolean; newPath: string }>(`/org-units/${unitId}/move`, {
        method: "PATCH",
        body: JSON.stringify({ newParentId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-units"] });
    },
  });

  const deleteTeam = useMutation({
    mutationFn: (unitId: string) =>
      apiClient<{ success: boolean }>(`/org-units/${unitId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-units"] });
    },
  });

  return {
    teams: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createTeam,
    moveTeam,
    deleteTeam,
  };
}
