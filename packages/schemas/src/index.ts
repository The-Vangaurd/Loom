import { z } from "zod";

// ==========================================
// Authentication Schemas
// ==========================================

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid business email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid business email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;

// ==========================================
// Role & Industry Onboarding Schemas
// ==========================================

export const IndustryRoleEnum = z.enum(["education", "software", "enterprise"]);
export type IndustryRole = z.infer<typeof IndustryRoleEnum>;

export const onboardingRoleSchema = z.object({
  role: IndustryRoleEnum,
  organizationName: z.string().min(2, "Organization name must be at least 2 characters long"),
  teamSize: z.enum(["1-10", "11-50", "51-200", "201-1000", "1000+"]).default("11-50"),
  primaryGoal: z.string().optional(),
});

export type OnboardingRoleInput = z.infer<typeof onboardingRoleSchema>;

// Role Configuration metadata
export interface RoleMetadata {
  id: IndustryRole;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  features: string[];
  defaultModules: string[];
}

export const ROLE_DEFINITIONS: Record<IndustryRole, RoleMetadata> = {
  education: {
    id: "education",
    title: "Education & Academics",
    tagline: "Universities, Colleges, Schools & EdTech",
    description: "Holistic student records, course enrollment, faculty timetable scheduling, fee collections, and compliance analytics.",
    badge: "Campus OS",
    features: [
      "Student Lifecycle & SIS",
      "Course & Exam Scheduling",
      "Automated Fee Billing & Invoices",
      "Faculty & Staff Workload Allocation",
      "Accreditation & Compliance Audits"
    ],
    defaultModules: ["students", "courses", "tuition_fees", "faculty", "attendance", "exams"]
  },
  software: {
    id: "software",
    title: "Software & Technology",
    tagline: "Product Teams, SaaS, Agencies & Engineering",
    description: "Sprint roadmaps, cloud resource cost attribution, recurring subscription billing, client retainers, and GitHub/CI delivery metrics.",
    badge: "Engineering Core",
    features: [
      "Agile Sprints & Milestone Roadmaps",
      "Cloud Infrastructure Cost Tracking",
      "Client Retainer & Subscription Invoicing",
      "Developer Velocity & Git CI Traceability",
      "API Quota & Token Spend Governance"
    ],
    defaultModules: ["sprints", "cloud_costs", "retainers", "developer_metrics", "sla_monitoring"]
  },
  enterprise: {
    id: "enterprise",
    title: "Manufacturing & Enterprise",
    tagline: "Supply Chain, Production, Logistics & Wholesale",
    description: "End-to-end inventory management, multi-warehouse logistics, supplier procurement, batch manufacturing, and GST/Tax compliance.",
    badge: "Supply Chain ERP",
    features: [
      "Multi-Warehouse Inventory & Lot Tracking",
      "Automated Vendor Purchase Orders",
      "Bill of Materials (BOM) & Work Orders",
      "Dispatch Logistics & Shipment Waybills",
      "Statutory Audit & GST E-Invoicing"
    ],
    defaultModules: ["inventory", "procurement", "production_bom", "warehouses", "gst_invoicing"]
  }
};
