import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { ClsServiceManager } from 'nestjs-cls';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://app:app_pass@localhost:5432/loom_erp',
});

// The global db instance (using the app role)
export const db = drizzle(pool, { schema });

// Helper to get the transaction-scoped db if it exists
export function getDb() {
  const cls = ClsServiceManager.getClsServiceIfNotContext();
  if (cls && cls.isActive()) {
    const tx = cls.get('tx');
    if (tx) return tx;
  }
  return db;
}
