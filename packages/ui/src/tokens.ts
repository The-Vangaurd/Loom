/**
 * AI-Native ERP Design Tokens v1.0
 * Pure CSS variable tokens aligned with the Design Language v1.0
 */

export const designTokens = {
  colors: {
    bg: "#000000",
    surface1: "#0B0B0C",
    surface2: "#121213",
    surface3: "#1A1A1B",
    surfaceHover: "#222223",
    borderSubtle: "rgba(222, 221, 219, 0.08)",
    borderStrong: "rgba(222, 221, 219, 0.16)",
    textPrimary: "#DEDDDB",
    textSecondary: "#A9A8A5",
    textTertiary: "#7C7B79",
    accent: "#D4DDFF",
    accentSoft: "rgba(212, 221, 255, 0.10)",
    accentGlow: "rgba(212, 221, 255, 0.16)",
    onAccent: "#000000",
    danger: "#D98082",
    dangerSoft: "rgba(217, 128, 130, 0.10)",
  },
  spacing: {
    base: "4px",
    rail: "56px",
    topbar: "56px",
    flyout: "240px",
    contentMax: "960px",
  },
  radii: {
    control: "8px",
    container: "12px",
    full: "9999px",
  },
  typography: {
    fontSans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
  },
} as const;
