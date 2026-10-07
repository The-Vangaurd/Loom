import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import { db } from "../db/index.js";
import { orgUnits, memberships } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";
import {
  CreateOrgUnitInput,
  OrgUnitNode,
} from "@loom/shared";
import { v4 as uuid } from "uuid";

@Injectable()
export class OrgUnitsService {
  constructor(@Inject(ClsService) private readonly cls: ClsService) {}

  private getClient() {
    return this.cls.get("tx") || db;
  }

  private getTenantId(): string {
    const tenantId = this.cls.get("tenantId");
    if (!tenantId) {
      throw new NotFoundException("Tenant context not found");
    }
    return tenantId;
  }

  async getTree(): Promise<OrgUnitNode[]> {
    const tenantId = this.getTenantId();
    const client = this.getClient();

    // Query all org units for this tenant ordered by path
    const rows = await client
      .select({
        id: orgUnits.id,
        tenantId: orgUnits.tenantId,
        name: orgUnits.name,
        path: sql<string>`path::text`,
        parentId: orgUnits.parentId,
        createdAt: orgUnits.createdAt,
        updatedAt: orgUnits.updatedAt,
      })
      .from(orgUnits)
      .where(eq(orgUnits.tenantId, tenantId))
      .orderBy(sql`path ASC`);

    // Fetch member count per org unit
    const counts = await client
      .select({
        orgUnitId: memberships.orgUnitId,
        count: sql<number>`count(*)::int`,
      })
      .from(memberships)
      .where(eq(memberships.tenantId, tenantId))
      .groupBy(memberships.orgUnitId);

    const countMap = new Map<string, number>();
    for (const c of counts) {
      if (c.orgUnitId) {
        countMap.set(c.orgUnitId, c.count);
      }
    }

    // Build node map
    const nodeMap = new Map<string, OrgUnitNode>();
    const rootNodes: OrgUnitNode[] = [];

    for (const row of rows) {
      const node: OrgUnitNode = {
        id: row.id,
        tenantId: row.tenantId,
        name: row.name,
        path: row.path,
        parentId: row.parentId,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        memberCount: countMap.get(row.id) ?? 0,
        children: [],
      };
      nodeMap.set(row.id, node);
    }

    for (const node of nodeMap.values()) {
      if (node.parentId && nodeMap.has(node.parentId)) {
        nodeMap.get(node.parentId)!.children!.push(node);
      } else {
        rootNodes.push(node);
      }
    }

    return rootNodes;
  }

  async createUnit(data: CreateOrgUnitInput): Promise<OrgUnitNode> {
    const tenantId = this.getTenantId();
    const client = this.getClient();

    let parentId = data.parentId;
    let parentPath = "root";

    if (parentId) {
      const parent = await client
        .select({
          id: orgUnits.id,
          path: sql<string>`path::text`,
        })
        .from(orgUnits)
        .where(eq(orgUnits.id, parentId))
        .limit(1);

      if (parent.length === 0) {
        throw new NotFoundException("Parent team not found");
      }
      parentPath = parent[0].path;
    } else {
      // Find default root unit for the tenant
      const root = await client
        .select({
          id: orgUnits.id,
          path: sql<string>`path::text`,
        })
        .from(orgUnits)
        .where(eq(orgUnits.tenantId, tenantId))
        .orderBy(sql`path ASC`)
        .limit(1);

      if (root.length > 0) {
        parentId = root[0].id;
        parentPath = root[0].path;
      }
    }

    // Generate valid ltree label (alphanumeric + underscore)
    const sanitizedSlug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 20) || "team";
    const label = `${sanitizedSlug}_${uuid().slice(0, 4)}`;
    const fullPath = `${parentPath}.${label}`;

    const id = uuid();
    const now = new Date();

    await client.execute(sql`
      INSERT INTO org_units (id, tenant_id, name, path, parent_id, "createdAt", "updatedAt")
      VALUES (${id}, ${tenantId}, ${data.name}, ${fullPath}::ltree, ${parentId ?? null}, ${now}, ${now})
    `);

    return {
      id,
      tenantId,
      name: data.name,
      path: fullPath,
      parentId: parentId ?? null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      memberCount: 0,
      children: [],
    };
  }

  async moveUnit(unitId: string, newParentId: string): Promise<{ success: boolean; newPath: string }> {
    const tenantId = this.getTenantId();
    const client = this.getClient();

    if (unitId === newParentId) {
      throw new BadRequestException("Cannot move a team into itself");
    }

    // 1. Get source unit
    const sourceRows = await client
      .select({
        id: orgUnits.id,
        path: sql<string>`path::text`,
        parentId: orgUnits.parentId,
      })
      .from(orgUnits)
      .where(eq(orgUnits.id, unitId))
      .limit(1);

    if (sourceRows.length === 0) {
      throw new NotFoundException("Source team not found");
    }

    const source = sourceRows[0];
    if (!source.parentId) {
      throw new BadRequestException("Cannot move root organization unit");
    }

    // 2. Get target parent unit
    const targetRows = await client
      .select({
        id: orgUnits.id,
        path: sql<string>`path::text`,
      })
      .from(orgUnits)
      .where(eq(orgUnits.id, newParentId))
      .limit(1);

    if (targetRows.length === 0) {
      throw new NotFoundException("Target parent team not found");
    }

    const target = targetRows[0];

    // 3. Cycle prevention: check if target is inside source subtree
    const cycleCheck = await client.execute(sql`
      SELECT 1 FROM org_units
      WHERE id = ${newParentId} AND path <@ ${source.path}::ltree
    `);

    if (cycleCheck.rows.length > 0) {
      throw new BadRequestException("Cannot move a team inside its own descendant");
    }

    // 4. Atomic PostgreSQL ltree reparenting of unit and all descendants
    // Calculate new base path
    const oldPath = source.path;
    const newParentPath = target.path;

    await client.execute(sql`
      UPDATE org_units
      SET
        path = (${newParentPath}::ltree || subpath(path, nlevel(${oldPath}::ltree) - 1)),
        parent_id = CASE WHEN id = ${unitId} THEN ${newParentId} ELSE parent_id END,
        "updatedAt" = NOW()
      WHERE tenant_id = ${tenantId} AND path <@ ${oldPath}::ltree;
    `);

    // Fetch updated path for the moved unit
    const updated = await client
      .select({
        path: sql<string>`path::text`,
      })
      .from(orgUnits)
      .where(eq(orgUnits.id, unitId))
      .limit(1);

    return {
      success: true,
      newPath: updated[0]?.path ?? "",
    };
  }

  async deleteUnit(unitId: string): Promise<{ success: boolean }> {
    const tenantId = this.getTenantId();
    const client = this.getClient();

    const rows = await client
      .select()
      .from(orgUnits)
      .where(eq(orgUnits.id, unitId))
      .limit(1);

    if (rows.length === 0) {
      throw new NotFoundException("Team not found");
    }

    const unit = rows[0];
    if (!unit.parentId) {
      throw new BadRequestException("Cannot delete root organization unit");
    }

    // Check if team has sub-teams
    const children = await client
      .select()
      .from(orgUnits)
      .where(eq(orgUnits.parentId, unitId))
      .limit(1);

    if (children.length > 0) {
      throw new BadRequestException(
        "Cannot delete a team with sub-teams. Move or delete sub-teams first."
      );
    }

    // Delete memberships referencing this unit
    await client
      .delete(memberships)
      .where(eq(memberships.orgUnitId, unitId));

    // Delete org unit
    await client
      .delete(orgUnits)
      .where(eq(orgUnits.id, unitId));

    return { success: true };
  }
}
