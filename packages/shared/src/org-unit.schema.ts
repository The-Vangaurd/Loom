import { z } from "zod";

export const createOrgUnitSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters").max(100),
  parentId: z.string().optional().nullable(),
});

export type CreateOrgUnitInput = z.infer<typeof createOrgUnitSchema>;

export const moveOrgUnitSchema = z.object({
  newParentId: z.string().min(1, "Target parent team ID is required"),
});

export type MoveOrgUnitInput = z.infer<typeof moveOrgUnitSchema>;

export const updateOrgUnitSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters").max(100).optional(),
});

export type UpdateOrgUnitInput = z.infer<typeof updateOrgUnitSchema>;

export interface OrgUnitNode {
  id: string;
  tenantId: string;
  name: string;
  path: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  children?: OrgUnitNode[];
}
