import { pgTable, text, timestamp, boolean, integer, jsonb } from "drizzle-orm/pg-core";

// --- Global Tables (No RLS - Identity Only) ---

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId').notNull().references(() => user.id)
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId').notNull().references(() => user.id),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt')
});

// --- Tenant Tables (Protected & Isolated via PostgreSQL RLS) ---

export const tenants = pgTable("tenants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  taxId: text("tax_id"),
  currency: text("currency").default("USD").notNull(),
  timezone: text("timezone").default("UTC").notNull(),
  logoUrl: text("logo_url"),
  modules: jsonb("modules").default({
    inventory: true,
    invoicing: true,
    procurement: true,
    hr: true,
    payroll: false,
    assets: false,
  }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});

export const tenantUsers = pgTable("tenant_users", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  userId: text("user_id").notNull().references(() => user.id),
  role: text("role").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});

export const auditLog = pgTable("audit_log", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  userId: text("user_id").references(() => user.id),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

// Phase 6 Expansion: Organization Units (ltree hierarchical path)
export const orgUnits = pgTable("org_units", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  name: text("name").notNull(),
  path: text("path").notNull(), // ltree path, e.g. "root.ops.warehouse"
  parentId: text("parent_id"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});

// Phase 6 Expansion: Role Templates
export const roles = pgTable("roles", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  name: text("name").notNull(),
  description: text("description"),
  isProtected: boolean("is_protected").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});

// Phase 6 Expansion: Role Permissions (module.resource.action)
export const rolePermissions = pgTable("role_permissions", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  roleId: text("role_id").notNull().references(() => roles.id),
  permission: text("permission").notNull(), // e.g. "inventory.items.read"
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

// Phase 6 Expansion: Scoped Memberships (user assigned role at org unit)
export const memberships = pgTable("memberships", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  userId: text("user_id").notNull().references(() => user.id),
  roleId: text("role_id").notNull().references(() => roles.id),
  orgUnitId: text("org_unit_id").references(() => orgUnits.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});

// Phase 6 Expansion: Team Invitations
export const invitations = pgTable("invitations", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  email: text("email").notNull(),
  roleId: text("role_id").notNull().references(() => roles.id),
  orgUnitId: text("org_unit_id").references(() => orgUnits.id),
  tokenHash: text("token_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

// Phase 6 Expansion: Import Batches
export const importBatches = pgTable("import_batches", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  filename: text("filename").notNull(),
  module: text("module").notNull(),
  rowCount: integer("row_count").notNull(),
  successCount: integer("success_count").default(0).notNull(),
  errorCount: integer("error_count").default(0).notNull(),
  status: text("status").notNull(), // "processing", "completed", "rolled_back"
  createdAt: timestamp("createdAt").defaultNow().notNull()
});

// Phase 6 Expansion: Tenant Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id),
  plan: text("plan").notNull(), // "trial", "growth", "enterprise"
  status: text("status").notNull(), // "active", "trialing", "past_due"
  seatsTotal: integer("seats_total").default(10).notNull(),
  storageTotalGB: integer("storage_total_gb").default(50).notNull(),
  renewsAt: timestamp("renews_at"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
