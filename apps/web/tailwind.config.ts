import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./context/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        "surface-1": "var(--surface-1)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        "surface-hover": "var(--surface-hover)",
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
        "accent-glow": "var(--accent-glow)",
        "on-accent": "var(--on-accent)",
        danger: "var(--danger)",
        "danger-soft": "var(--danger-soft)",
        loom: "#FFEFD4",
      },
      borderRadius: {
        control: "8px",
        container: "12px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'Iosevka Charon Mono'", "monospace"],
        heading: ["'Iosevka Charon Mono'", "monospace"],
      },
      boxShadow: {
        level1: "0 4px 12px rgba(0, 0, 0, 0.5)",
        level2: "0 8px 24px rgba(0, 0, 0, 0.6)",
        level3: "0 16px 48px rgba(0, 0, 0, 0.7)",
        accent: "0 0 32px var(--accent-glow)",
      },
    },
  },
  plugins: [],
};

export default config;
