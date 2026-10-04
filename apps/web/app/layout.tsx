import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@fontsource/iosevka-charon-mono/300.css";
import "@fontsource/iosevka-charon-mono/400.css";
import "@fontsource/iosevka-charon-mono/500.css";
import "@fontsource/iosevka-charon-mono/700.css";
import { AuthProvider } from "@/context/auth-context";
import { ThemeProvider } from "@/context/theme-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "loom | AI-Native ERP",
  description: "Autonomous enterprise workflows, unified intelligence, and modular industry workspaces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const params = new URLSearchParams(window.location.search);
                const qTheme = params.get('theme');
                const stored = localStorage.getItem('erp_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (qTheme === 'dark' || (!qTheme && (stored === 'dark' || (!stored && prefersDark)))) {
                  document.documentElement.classList.add('dark');
                } else if (qTheme === 'light' || stored === 'light') {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-bg text-text-primary antialiased min-h-screen selection:bg-accent-soft selection:text-accent transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
