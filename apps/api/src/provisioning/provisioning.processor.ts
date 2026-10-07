import { Worker, Job } from "bullmq";
import { db } from "../db/index.js";
import { sql } from "drizzle-orm";
import { v4 as uuid } from "uuid";
import { TenantProvisioningJobData } from "./provisioning.types.js";

export function startProvisioningWorker() {
  const worker = new Worker<TenantProvisioningJobData>(
    "tenant-provisioning",
    async (job: Job<TenantProvisioningJobData>) => {
      const { tenantId, companyName, slug, userId } = job.data;
      console.log(`[BullMQ Worker] Starting provisioning for tenant: ${companyName} (${tenantId})`);

      // We run in a single atomic transaction
      await db.transaction(async (tx) => {
        // 1. Bootstrap tenant and assign user as Owner via SECURITY DEFINER function
        await tx.execute(
          sql`SELECT create_tenant(${tenantId}::text, ${companyName}::text, ${slug}::text, ${userId}::text)`
        );

        // 2. Set tenant isolation context for remaining entities
        await tx.execute(sql`SELECT set_config('app.tenant_id', ${tenantId}, true)`);

        // 3. Create root organization unit
        const rootOrgId = uuid();
        await tx.execute(
          sql`INSERT INTO org_units (id, tenant_id, name, path, parent_id)
              VALUES (${rootOrgId}, ${tenantId}, ${companyName}, 'root', NULL)
              ON CONFLICT (id) DO NOTHING`
        );

        // 4. Create protected Owner role template
        const ownerRoleId = uuid();
        await tx.execute(
          sql`INSERT INTO roles (id, tenant_id, name, description, is_protected)
              VALUES (${ownerRoleId}, ${tenantId}, 'Owner', 'Complete administrative authority', true)
              ON CONFLICT (id) DO NOTHING`
        );

        // 5. Grant core permissions
        const corePerms = [
          "inventory.items.read", "inventory.items.write", "inventory.adjust.execute",
          "invoicing.invoices.read", "invoicing.invoices.create", "invoicing.invoices.void",
          "procurement.po.read", "procurement.po.approve"
        ];
        for (const perm of corePerms) {
          await tx.execute(
            sql`INSERT INTO role_permissions (id, tenant_id, role_id, permission)
                VALUES (${uuid()}, ${tenantId}, ${ownerRoleId}, ${perm})`
          );
        }

        // 6. Assign user to root membership
        await tx.execute(
          sql`INSERT INTO memberships (id, tenant_id, user_id, role_id, org_unit_id)
              VALUES (${uuid()}, ${tenantId}, ${userId}, ${ownerRoleId}, ${rootOrgId})`
        );

        // 7. Create default trial subscription
        await tx.execute(
          sql`INSERT INTO subscriptions (id, tenant_id, plan, status, seats_total, storage_total_gb)
              VALUES (${uuid()}, ${tenantId}, 'enterprise_trial', 'active', 50, 100)`
        );

        // 8. Immutable audit record
        await tx.execute(
          sql`INSERT INTO audit_log (id, tenant_id, user_id, action, resource, details)
              VALUES (${uuid()}, ${tenantId}, ${userId}, 'tenant.provisioned', 'workspace', 'Workspace successfully provisioned via BullMQ worker')`
        );
      });

      console.log(`[BullMQ Worker] Finished provisioning for tenant: ${companyName}`);
    },
    {
      connection: {
        host: "localhost",
        port: 6379,
      },
    }
  );

  return worker;
}
