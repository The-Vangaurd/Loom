-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS ltree;

-- Create Roles
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'migrator') THEN
    CREATE ROLE migrator WITH LOGIN PASSWORD 'migrator_pass';
  END IF;
  
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app') THEN
    CREATE ROLE app WITH LOGIN PASSWORD 'app_pass' NOBYPASSRLS;
  END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE loom_erp TO migrator;
GRANT ALL ON SCHEMA public TO migrator;
-- Ensure app can connect and use public schema
GRANT CONNECT ON DATABASE loom_erp TO app;
GRANT USAGE ON SCHEMA public TO app;

-- Make sure app does not have ownership or BYPASSRLS
ALTER ROLE app NOBYPASSRLS;
