import type { LoginInput, SignUpInput, IndustryRole } from "@erp/schemas";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role?: string;
  organizationId?: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: IndustryRole;
  teamSize?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthSession {
  login: (credentials: LoginInput) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignUpInput) => Promise<{ success: boolean; error?: string }>;
  setOrganizationRole: (role: IndustryRole, organizationName: string) => Promise<void>;
  logout: () => Promise<void>;
}
