-- Force RLS on tenant tables
ALTER TABLE tenants FORCE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

ALTER TABLE tenant_users FORCE ROW LEVEL SECURITY;
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;

ALTER TABLE audit_log FORCE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Note: user, session, account, verification intentionally do not have RLS (global tables)

-- Policies for tenants
CREATE POLICY tenant_isolation_policy ON tenants
  FOR ALL
  TO app
  USING (id = current_setting('app.tenant_id', true))
  WITH CHECK (id = current_setting('app.tenant_id', true));

-- Policies for tenant_users
CREATE POLICY tenant_users_isolation_policy ON tenant_users
  FOR ALL
  TO app
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

-- Policies for audit_log
-- The app role can only INSERT and SELECT, it cannot UPDATE or DELETE
CREATE POLICY audit_log_isolation_insert_select_policy ON audit_log
  FOR ALL
  TO app
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));

REVOKE UPDATE, DELETE ON audit_log FROM app;

-- Helper function for tenant creation (SECURITY DEFINER to bypass RLS initially)
CREATE OR REPLACE FUNCTION create_tenant(
  p_id TEXT,
  p_name TEXT,
  p_slug TEXT,
  p_user_id TEXT
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert tenant
  INSERT INTO tenants (id, name, slug) VALUES (p_id, p_name, p_slug);
  
  -- Insert the founding user as an admin in tenant_users
  INSERT INTO tenant_users (id, tenant_id, user_id, role) 
  VALUES (gen_random_uuid()::text, p_id, p_user_id, 'admin');
END;
$$;
