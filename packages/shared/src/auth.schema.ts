import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid work email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name cannot exceed 100 characters"),
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please provide a valid work email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service and Privacy Policy",
  }),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d+$/, "Verification code must be numeric"),
});
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please provide a valid work email address"),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    newPassword: z
      .string()
      .min(12, "Password needs at least 12 characters")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const mfaChallengeSchema = z.object({
  code: z
    .string()
    .length(6, "Authenticator code must be 6 digits")
    .regex(/^\d+$/, "Code must be numeric"),
});
export type MfaChallengeInput = z.infer<typeof mfaChallengeSchema>;

export const acceptInviteSchema = z
  .object({
    inviteToken: z.string().min(1, "Invitation token is required"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    password: z
      .string()
      .min(12, "Password needs at least 12 characters")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
