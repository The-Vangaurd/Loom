# loom

> **AI-Native ERP Platform** — Autonomous enterprise workflows, domain-specific agent architectures, and high-performance operational intelligence.

---

## 🌟 Overview

**loom** is an AI-Native Enterprise Resource Planning (ERP) platform designed for modern autonomous business operations. It combines dynamic operational agent networks, real-time schema adaptors, and tailored industry verticals into a unified, responsive interface.

### Key Highlights
- **Fluid Dual-Pane Authentication**: High-precision dual-sliding authentication flow with fluid cubic-bezier physics, zero-layout-shift error notifications, and credentials authentication.
- **Role-Based Vertical Onboarding**: Archetype selection supporting **Campus OS** (Education & Research), **Engineering Core** (Software & Cloud), and **Supply Chain ERP** (Manufacturing & Logistics).
- **Dual-Mode Visual Design System**: Calibrated Light (Stone White / Platinum `#DEDDDB`) and Dark (`#000000`) modes with periwinkle (`#D4DDFF`) accents and instant pre-hydration theme initialization.
- **Autonomous Agent Operations Dashboard**: Modular operational grids, system telemetry, autonomous agent action rails, and schema management.
- **Harmonious Typography**: Strategic pairing of **Iosevka Charon Mono** for headings, metrics, status badges, and data points, alongside clean body sans typography.

---

## 🏗️ Architecture & Monorepo Structure

Managed via **pnpm workspaces** and **Turborepo** for optimal caching and fast parallel builds:

```
loom/
├── apps/
│   ├── web/                     # Next.js 15 (App Router), Tailwind CSS, Lucide Icons, Radix UI
│   └── api/                     # Express + TypeScript standalone API server
├── packages/
│   ├── schemas/                 # Pinned Zod validation schemas (Auth, Onboarding, Vertical Roles)
│   ├── ui/                      # Design system tokens (#000000, #DEDDDB, #D4DDFF) & UI primitives
│   ├── auth/                    # Better Auth interfaces and session types
│   └── tsconfig/                # Shared base, Next.js, Node, and React tsconfig presets
├── turbo.json                   # Pipeline build and dev caching orchestration
├── pnpm-workspace.yaml          # Monorepo workspace configuration
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17+` or `v20+`
- **pnpm**: `v8.0+` or `v9.0+`

### Installation

Clone the repository and install all workspace dependencies:

```bash
git clone https://github.com/The-Vangaurd/Loom.git
cd Loom
pnpm install
```

### Development

Run all applications and services concurrently:

```bash
pnpm dev
```

Or run individual apps:

```bash
# Run Next.js Frontend (http://localhost:3000)
pnpm --filter web dev

# Run Backend API Server (http://localhost:4000)
pnpm --filter api dev
```

### Production Build

Create optimized production bundles across all packages and apps:

```bash
pnpm build
```

To start the production server:

```bash
pnpm --filter web start --port 3000
```

---

## 🎨 Design Tokens

| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| **Black** | `#000000` | Dark mode canvas, high-contrast actions, primary borders |
| **Platinum / Stone White** | `#DEDDDB` | Light mode canvas, outer layout wrappers |
| **Periwinkle** | `#D4DDFF` | Brand glow, accent rings, badges, sliding panels |
| **Loom Ivory** | `#FFEFD4` | Wordmark brand color in dark mode |
| **Input Completed** | `#E8F0FE` | Soft blue background for filled valid fields |
| **Input Error** | `#FEF2F2` | Soft red background with `#EF4444` border for validation errors |

---

## 📜 License

Private & Proprietary. All rights reserved.
