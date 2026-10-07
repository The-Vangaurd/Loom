import { Worker, Job, Processor } from 'bullmq';
import { ClsServiceManager } from 'nestjs-cls';
import { db } from '../db';
import { sql } from 'drizzle-orm';

export interface TenantJobData {
  tenantId?: string;
  [key: string]: any;
}

/**
 * Creates a BullMQ worker that automatically wraps job processing in a transaction 
 * and sets the tenant context in PostgreSQL.
 */
export function createTenantWorker(
  queueName: string, 
  processor: Processor<TenantJobData>, 
  connection: any // Redis connection
) {
  return new Worker(queueName, async (job: Job<TenantJobData>) => {
    const cls = ClsServiceManager.getClsService();
    
    return cls.run(async () => {
      const tenantId = job.data.tenantId;
      if (tenantId) {
        cls.set('tenantId', tenantId);
      }
      
      // Wrap job in a transaction
      return db.transaction(async (tx) => {
        if (tenantId) {
          await tx.execute(sql`SELECT set_config('app.tenant_id', ${tenantId}, true)`);
        }
        cls.set('tx', tx);
        
        try {
          // Process job
          return await processor(job);
        } catch (error) {
          // Rollback on failure
          throw error;
        }
      });
    });
  }, { connection });
}
