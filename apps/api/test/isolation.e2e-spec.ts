import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Client } from 'pg';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import { v4 as uuid } from 'uuid';

describe('Row Level Security & Isolation', () => {
  let migratorClient: Client;
  let appClient: Client;
  
  beforeAll(async () => {
    // 1. Connect as migrator and run migrations
    migratorClient = new Client({
      connectionString: process.env.DATABASE_URL || 'postgres://migrator:migrator_pass@localhost:5432/loom_erp'
    });
    await migratorClient.connect();
    
    const migratorDb = drizzle(migratorClient);
    await migrate(migratorDb, { migrationsFolder: './drizzle' });
    
    // Test that migrations are repeatable
    await migrate(migratorDb, { migrationsFolder: './drizzle' });

    // Connect as app role
    appClient = new Client({
      connectionString: process.env.DATABASE_URL?.replace('migrator:migrator_pass', 'app:app_pass') || 'postgres://app:app_pass@localhost:5432/loom_erp'
    });
    await appClient.connect();
  });

  afterAll(async () => {
    await migratorClient.end();
    await appClient.end();
  });

  it('Confirms the app role is not superuser and has no BYPASSRLS', async () => {
    const res = await appClient.query(`
      SELECT rolsuper, rolbypassrls 
      FROM pg_roles 
      WHERE rolname = current_user
    `);
    expect(res.rows[0].rolsuper).toBe(false);
    expect(res.rows[0].rolbypassrls).toBe(false);
  });

  it('RLS fail-closed: queries return 0 rows when tenant is not set', async () => {
    const res = await appClient.query('SELECT count(*) FROM tenants');
    expect(parseInt(res.rows[0].count)).toBe(0);
  });

  it('Isolates data properly across tenants', async () => {
    const tenantA = uuid();
    const tenantB = uuid();
    const userA = uuid();
    const userB = uuid();

    // Insert global users
    await migratorClient.query(`INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt") VALUES ($1, 'User A', '${uuid()}@a.com', true, now(), now())`, [userA]);
    await migratorClient.query(`INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt") VALUES ($1, 'User B', '${uuid()}@b.com', true, now(), now())`, [userB]);

    // Bootstrap tenants via SECURITY DEFINER function
    await appClient.query(`SELECT create_tenant($1::text, 'Tenant A'::text, 'tenant-a-' || substr(md5(random()::text), 1, 6)::text, $2::text)`, [tenantA, userA]);
    await appClient.query(`SELECT create_tenant($1::text, 'Tenant B'::text, 'tenant-b-' || substr(md5(random()::text), 1, 6)::text, $2::text)`, [tenantB, userB]);

    // Test: Connect as app role, set tenant A, query tenant B's row
    await appClient.query('BEGIN');
    await appClient.query(`SELECT set_config('app.tenant_id', $1, true)`, [tenantA]);
    
    const res = await appClient.query(`SELECT * FROM tenants`);
    expect(res.rows.length).toBe(1);
    expect(res.rows[0].id).toBe(tenantA);

    await appClient.query('ROLLBACK');
  });

  it('WITH CHECK rejects inserting data into another tenant', async () => {
    const tenantA = uuid();
    await appClient.query('BEGIN');
    await appClient.query(`SELECT set_config('app.tenant_id', $1, true)`, [tenantA]);
    
    // Expect error when trying to insert into audit_log with a mismatched tenant_id
    await expect(
      appClient.query(`INSERT INTO audit_log (id, tenant_id, action, resource) VALUES ($1, (SELECT id FROM tenants LIMIT 1), 'test', 'test')`, [uuid()])
    ).rejects.toThrow(/new row violates row-level security policy/);

    await appClient.query('ROLLBACK');
  });

  it('Rejects UPDATE and DELETE on audit_log for the app role', async () => {
    await appClient.query('BEGIN');
    await expect(
      appClient.query(`UPDATE audit_log SET action = 'tampered'`)
    ).rejects.toThrow(/permission denied for table audit_log/);
    await appClient.query('ROLLBACK');

    await appClient.query('BEGIN');
    await expect(
      appClient.query(`DELETE FROM audit_log`)
    ).rejects.toThrow(/permission denied for table audit_log/);
    await appClient.query('ROLLBACK');
  });

  it('Enforces fail-closed RLS on expanded Phase 6 tables', async () => {
    const tables = ['org_units', 'roles', 'role_permissions', 'memberships', 'invitations', 'import_batches', 'subscriptions'];
    for (const table of tables) {
      const res = await appClient.query(`SELECT count(*) FROM ${table}`);
      expect(parseInt(res.rows[0].count)).toBe(0);
    }
  });

  it('Isolates roles and org_units across tenants', async () => {
    const tenantA = uuid();
    const tenantB = uuid();
    const userA = uuid();
    const userB = uuid();

    await migratorClient.query(`INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt") VALUES ($1, 'User X', '${uuid()}@x.com', true, now(), now())`, [userA]);
    await migratorClient.query(`INSERT INTO "user" (id, name, email, "emailVerified", "createdAt", "updatedAt") VALUES ($1, 'User Y', '${uuid()}@y.com', true, now(), now())`, [userB]);

    await appClient.query(`SELECT create_tenant($1::text, 'Org A'::text, 'org-a-' || substr(md5(random()::text), 1, 6)::text, $2::text)`, [tenantA, userA]);
    await appClient.query(`SELECT create_tenant($1::text, 'Org B'::text, 'org-b-' || substr(md5(random()::text), 1, 6)::text, $2::text)`, [tenantB, userB]);

    // Insert roles as tenant A
    await appClient.query('BEGIN');
    await appClient.query(`SELECT set_config('app.tenant_id', $1, true)`, [tenantA]);
    await appClient.query(`INSERT INTO roles (id, tenant_id, name, description) VALUES ($1, $2, 'Custom Manager', 'Manager description')`, [uuid(), tenantA]);
    await appClient.query('COMMIT');

    // Query roles as tenant B -> must NOT see tenant A's role
    await appClient.query('BEGIN');
    await appClient.query(`SELECT set_config('app.tenant_id', $1, true)`, [tenantB]);
    const resB = await appClient.query(`SELECT * FROM roles`);
    expect(resB.rows.length).toBe(0);
    await appClient.query('ROLLBACK');

    // Query roles as tenant A -> must see tenant A's role
    await appClient.query('BEGIN');
    await appClient.query(`SELECT set_config('app.tenant_id', $1, true)`, [tenantA]);
    const resA = await appClient.query(`SELECT * FROM roles`);
    expect(resA.rows.length).toBe(1);
    expect(resA.rows[0].name).toBe('Custom Manager');
    await appClient.query('ROLLBACK');
  });
});
