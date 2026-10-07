-- Convert org_units.path to native ltree type and create GiST index
ALTER TABLE org_units ALTER COLUMN path TYPE ltree USING path::ltree;
CREATE INDEX IF NOT EXISTS org_units_path_gist_idx ON org_units USING GIST (path);
