"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthContextType, User, Organization } from "@erp/auth";
import type { LoginInput, SignUpInput, IndustryRole } from "@erp/schemas";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("erp_user");
      const storedOrg = localStorage.getItem("erp_org");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedOrg) {
        setOrganization(JSON.parse(storedOrg));
      }
    } catch (e) {
      console.error("Failed to load auth session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginInput): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Simulate network request & validation
      await new Promise((resolve) => setTimeout(resolve, 600));

      const mockUser: User = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        name: credentials.email.split("@")[0] || "Executive",
        email: credentials.email,
        role: "admin",
      };

      setUser(mockUser);
      localStorage.setItem("erp_user", JSON.stringify(mockUser));
      return { success: true };
    } catch {
      return { success: false, error: "Invalid credentials. Please verify your email and password." };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpInput): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      const mockUser: User = {
        id: "usr_" + Math.random().toString(36).substring(2, 9),
        name: data.name,
        email: data.email,
        role: "founder",
      };

      setUser(mockUser);
      localStorage.setItem("erp_user", JSON.stringify(mockUser));
      return { success: true };
    } catch {
      return { success: false, error: "Sign up failed. Please try again." };
    } finally {
      setIsLoading(false);
    }
  };

  const setOrganizationRole = async (role: IndustryRole, organizationName: string) => {
    const newOrg: Organization = {
      id: "org_" + Math.random().toString(36).substring(2, 9),
      name: organizationName,
      industry: role,
      createdAt: new Date().toISOString(),
    };

    setOrganization(newOrg);
    localStorage.setItem("erp_org", JSON.stringify(newOrg));
  };

  const logout = async () => {
    setUser(null);
    setOrganization(null);
    localStorage.removeItem("erp_user");
    localStorage.removeItem("erp_org");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        isAuthenticated: !!user,
        isLoading,
        login,
        signUp,
        setOrganizationRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
