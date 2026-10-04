"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { loginSchema, signUpSchema } from "@erp/schemas";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoomLogo } from "@/components/loom-logo";
import { AlertCircle } from "lucide-react";
import "./auth.css";

export default function AuthPage() {
  const router = useRouter();
  const { login, signUp } = useAuth();

  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Sign up form state
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpErrors, setSignUpErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [activeSignUpField, setActiveSignUpField] = useState<string | null>(null);
  const [activeLoginField, setActiveLoginField] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("panel") === "signup") {
      setIsRightPanelActive(true);
    }
    if (params.get("testError") === "name" || params.get("testValidation") === "true") {
      setIsRightPanelActive(true);
      setSignUpEmail("employee@acme.com");
      setSignUpPassword("password123");
      setSignUpErrors({ name: "Please fill out this field." });
    }
    if (params.get("testLoginError") === "email") {
      setIsRightPanelActive(false);
      setLoginPassword("secret123");
      setLoginErrors({ email: "Please fill out this field." });
    }
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const errors: { email?: string; password?: string } = {};

    if (!loginEmail.trim()) {
      errors.email = "Please fill out this field.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(loginEmail.trim())) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (!loginPassword) {
      errors.password = "Please fill out this field.";
    } else if (loginPassword.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }

    setLoginErrors({});
    setLoading(true);
    const res = await login({ email: loginEmail.trim(), password: loginPassword });
    setLoading(false);

    if (res.success) {
      router.push("/onboarding");
    } else {
      setErrorMessage(res.error || "Login failed");
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const errors: { name?: string; email?: string; password?: string } = {};

    if (!signUpName.trim()) {
      errors.name = "Please fill out this field.";
    } else if (signUpName.trim().length < 2) {
      errors.name = "Name must be at least 2 characters.";
    }

    if (!signUpEmail.trim()) {
      errors.email = "Please fill out this field.";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signUpEmail.trim())) {
        errors.email = "Please enter a valid email address.";
      }
    }

    if (!signUpPassword) {
      errors.password = "Please fill out this field.";
    } else if (signUpPassword.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setSignUpErrors(errors);
      return;
    }

    setSignUpErrors({});
    setLoading(true);
    const res = await signUp({
      name: signUpName.trim(),
      email: signUpEmail.trim(),
      password: signUpPassword,
    });
    setLoading(false);

    if (res.success) {
      router.push("/onboarding");
    } else {
      setErrorMessage(res.error || "Registration failed");
    }
  };

  const currentSignUpErrorField =
    (activeSignUpField && signUpErrors[activeSignUpField as keyof typeof signUpErrors])
      ? activeSignUpField
      : signUpErrors.name
      ? "name"
      : signUpErrors.email
      ? "email"
      : signUpErrors.password
      ? "password"
      : null;

  const currentLoginErrorField =
    (activeLoginField && loginErrors[activeLoginField as keyof typeof loginErrors])
      ? activeLoginField
      : loginErrors.email
      ? "email"
      : loginErrors.password
      ? "password"
      : null;

  return (
    <main className="auth-wrapper">
      {/* Brand Logo in top left */}
      <div className="absolute top-6 left-6 z-50">
        <LoomLogo size="sm" />
      </div>

      {/* Theme Toggle in top right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <div className={`auth-container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
        {/* Sign Up / Get Started Form (revealed when active) */}
        <div className="auth-form-container auth-get-started-container">
          <form noValidate onSubmit={handleSignUpSubmit}>
            <h1>Get Started</h1>
            
            {/* Social Icons */}
            <div className="auth-social-container">
              <button type="button" className="auth-social-btn" aria-label="Google">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </button>
              <button type="button" className="auth-social-btn" aria-label="GitHub">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </button>
              <button type="button" className="auth-social-btn" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6 1.6-.72 1.6-1.6-.72-1.6-1.6-1.6Z"/>
                </svg>
              </button>
            </div>

            <span>Get started with Email & Password</span>

            {errorMessage && isRightPanelActive && (
              <div className="auth-error-banner">
                {errorMessage}
              </div>
            )}

            <div className={`auth-field-group ${currentSignUpErrorField === "name" ? "has-error z-30" : ""}`}>
              <input
                type="text"
                placeholder="Enter Name"
                value={signUpName}
                onFocus={() => setActiveSignUpField("name")}
                onChange={(e) => {
                  setSignUpName(e.target.value);
                  if (signUpErrors.name) setSignUpErrors((p) => ({ ...p, name: undefined }));
                }}
                className={signUpErrors.name ? "is-error" : signUpName.trim().length > 0 ? "is-completed" : ""}
              />
              {currentSignUpErrorField === "name" && signUpErrors.name && (
                <div className="auth-overlapping-pop" role="alert">
                  <span className="auth-overlapping-pop-arrow" />
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{signUpErrors.name}</span>
                </div>
              )}
            </div>

            <div className={`auth-field-group ${currentSignUpErrorField === "email" ? "has-error z-20" : ""}`}>
              <input
                type="email"
                placeholder="Enter E-mail"
                value={signUpEmail}
                onFocus={() => setActiveSignUpField("email")}
                onChange={(e) => {
                  setSignUpEmail(e.target.value);
                  if (signUpErrors.email) setSignUpErrors((p) => ({ ...p, email: undefined }));
                }}
                className={signUpErrors.email ? "is-error" : signUpEmail.trim().length > 0 ? "is-completed" : ""}
              />
              {currentSignUpErrorField === "email" && signUpErrors.email && (
                <div className="auth-overlapping-pop" role="alert">
                  <span className="auth-overlapping-pop-arrow" />
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{signUpErrors.email}</span>
                </div>
              )}
            </div>

            <div className={`auth-field-group ${currentSignUpErrorField === "password" ? "has-error z-10" : ""}`}>
              <input
                type="password"
                placeholder="Enter Password"
                value={signUpPassword}
                onFocus={() => setActiveSignUpField("password")}
                onChange={(e) => {
                  setSignUpPassword(e.target.value);
                  if (signUpErrors.password) setSignUpErrors((p) => ({ ...p, password: undefined }));
                }}
                className={signUpErrors.password ? "is-error" : signUpPassword.length > 0 ? "is-completed" : ""}
              />
              {currentSignUpErrorField === "password" && signUpErrors.password && (
                <div className="auth-overlapping-pop" role="alert">
                  <span className="auth-overlapping-pop-arrow" />
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{signUpErrors.password}</span>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="auth-btn auth-btn-primary">
              {loading ? "CREATING..." : "GET STARTED"}
            </button>
          </form>
        </div>

        {/* Login Form (Default left side) */}
        <div className="auth-form-container auth-login-container">
          <form noValidate onSubmit={handleLoginSubmit}>
            <h1>Login</h1>

            {/* Social Icons */}
            <div className="auth-social-container">
              <button type="button" className="auth-social-btn" aria-label="Google">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </button>
              <button type="button" className="auth-social-btn" aria-label="GitHub">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </button>
              <button type="button" className="auth-social-btn" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6 1.6-.72 1.6-1.6-.72-1.6-1.6-1.6Z"/>
                </svg>
              </button>
            </div>

            <span>Login with Email & Password</span>

            {errorMessage && !isRightPanelActive && (
              <div className="auth-error-banner">
                {errorMessage}
              </div>
            )}

            <div className={`auth-field-group ${currentLoginErrorField === "email" ? "has-error z-20" : ""}`}>
              <input
                type="email"
                placeholder="Enter E-mail"
                value={loginEmail}
                onFocus={() => setActiveLoginField("email")}
                onChange={(e) => {
                  setLoginEmail(e.target.value);
                  if (loginErrors.email) setLoginErrors((p) => ({ ...p, email: undefined }));
                }}
                className={loginErrors.email ? "is-error" : loginEmail.trim().length > 0 ? "is-completed" : ""}
              />
              {currentLoginErrorField === "email" && loginErrors.email && (
                <div className="auth-overlapping-pop" role="alert">
                  <span className="auth-overlapping-pop-arrow" />
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{loginErrors.email}</span>
                </div>
              )}
            </div>

            <div className={`auth-field-group ${currentLoginErrorField === "password" ? "has-error z-10" : ""}`}>
              <input
                type="password"
                placeholder="Enter Password"
                value={loginPassword}
                onFocus={() => setActiveLoginField("password")}
                onChange={(e) => {
                  setLoginPassword(e.target.value);
                  if (loginErrors.password) setLoginErrors((p) => ({ ...p, password: undefined }));
                }}
                className={loginErrors.password ? "is-error" : loginPassword.length > 0 ? "is-completed" : ""}
              />
              {currentLoginErrorField === "password" && loginErrors.password && (
                <div className="auth-overlapping-pop" role="alert">
                  <span className="auth-overlapping-pop-arrow" />
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span>{loginErrors.password}</span>
                </div>
              )}
            </div>

            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert("Password reset instructions sent to your registered email.");
              }}
              className="auth-forgot-password"
            >
              Forget Password?
            </a>

            <button type="submit" disabled={loading} className="auth-btn auth-btn-primary">
              {loading ? "LOGGING IN..." : "LOGIN"}
            </button>
          </form>
        </div>

        {/* Sliding Overlay Container (Periwinkle #D4DDFF) */}
        <div className="auth-overlay-container">
          <div className="auth-overlay">
            {/* Left Overlay Panel (shows when on Get Started form to go back to Login) */}
            <div className="auth-overlay-panel auth-overlay-left">
              <h1>Log In to Your Company</h1>
              <p>Access your organization&apos;s workspace and continue managing your enterprise operations</p>
              <button
                type="button"
                className="auth-btn auth-btn-ghost"
                onClick={() => {
                  setErrorMessage(null);
                  setSignUpErrors({});
                  setLoginErrors({});
                  setIsRightPanelActive(false);
                }}
              >
                LOGIN
              </button>
            </div>

            {/* Right Overlay Panel (default state showing Create Your ERP) */}
            <div className="auth-overlay-panel auth-overlay-right">
              <h1>Create Your ERP</h1>
              <p>Sign up to start building and streamlining your enterprise workflows</p>
              <button
                type="button"
                className="auth-btn auth-btn-ghost"
                onClick={() => {
                  setErrorMessage(null);
                  setSignUpErrors({});
                  setLoginErrors({});
                  setIsRightPanelActive(true);
                }}
              >
                GET STARTED
              </button>
            </div>
          </div>
          {/* Liquid wave edge decorator */}
          <div className="auth-liquid-wave-edge" aria-hidden="true" />
        </div>
      </div>
    </main>
  );
}
