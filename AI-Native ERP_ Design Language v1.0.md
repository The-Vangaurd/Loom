# AI-Native ERP: Design Language v1.0

## 1. Principles

1. **Calm over loud.** Black canvas, grey structure, one accent. Nothing competes for attention that has not earned it.
2. **Trust through precision.** Exact alignment, tabular numbers, formal wording, predictable behavior.
3. **Airy, not sparse.** Balanced density with generous breathing room. Tables and forms remain efficient, but never cramped.
4. **AI is a quiet colleague.** It appears when summoned (Cmd+K) and always shows what it is about to do before it does it.

## 2. Color

Dark-first. The three brand colors carry the system: **#000000** (canvas), **#DEDDDB** (warm grey, all text and structure), **#D4DDFF** (periwinkle, the only signal color). Intermediate greys are derived from #DEDDDB.

| Token | Value | Use |
| --- | --- | --- |
| `bg` | #000000 | App canvas |
| `surface-1` | #0B0B0C | Cards, panels, sidebar flyout |
| `surface-2` | #121213 | Inputs, table header, raised cards |
| `surface-3` | #1A1A1B | Menus, popovers, dialogs |
| `surface-hover` | #222223 | Hover on rows and items |
| `border-subtle` | rgba(222,221,219,0.08) | Dividers, card edges |
| `border-strong` | rgba(222,221,219,0.16) | Inputs, focused containers |
| `text-primary` | #DEDDDB | Headings, body, values |
| `text-secondary` | #A9A8A5 | Labels, supporting text |
| `text-tertiary` | #7C7B79 | Placeholders, disabled, metadata |
| `accent` | #D4DDFF | Primary actions, focus, selection, AI, success |
| `accent-soft` | rgba(212,221,255,0.10) | Selected rows, active nav, AI surfaces |
| `accent-glow` | rgba(212,221,255,0.16) | Focus ring and glow layers |
| `on-accent` | #000000 | Text on accent fills |
| `danger` | #D98082 | Errors and destructive actions only |
| `danger-soft` | rgba(217,128,130,0.10) | Error backgrounds |

**Rules**

- Roughly 90% of any screen is `bg`, surfaces, and greys. Accent appears in small, deliberate doses.
- Red is never decorative. It appears only on errors and on destructive confirmations.
- All text meets WCAG AA (4.5:1) on `bg` and on `surface-1` to `surface-3`.
- Light theme is a later phase. Inverting the palette means #DEDDDB becomes the canvas and #D4DDFF must be darkened, because it fails contrast on light backgrounds.

### Status without a color set

Status is carried by icon, label, and tone, never by hue alone.

| State | Treatment |
| --- | --- |
| Success / Approved | Accent check icon, accent-soft chip, label "Approved" |
| In progress / Pending | Grey clock icon, surface-3 chip, label "Pending" |
| Needs review | Triangle icon, text-primary on surface-3 with strong border, label "Needs review" |
| Info | Accent outline chip, info icon |
| Error / Failed | Danger icon, danger-soft chip, label "Failed" |

## 3. Typography

- **Interface:** Inter (fallback: system sans). Neutral and official.
- **Data:** JetBrains Mono, or Inter with tabular numerals, for amounts, IDs, dates, and codes. Numbers are right-aligned in tables.

| Style | Size / line | Weight |
| --- | --- | --- |
| Display | 40 / 48 | 600 |
| Title | 28 / 36 | 600 |
| Heading | 20 / 28 | 600 |
| Subheading | 16 / 24 | 500 |
| Body (base) | 14 / 22 | 400 |
| Label | 13 / 20 | 500 |
| Caption | 12 / 16 | 400, +0.02em tracking |

Sentence case everywhere. No all-caps except small table column headers (12px, +0.04em, `text-secondary`).

## 4. Space, shape, and depth

**Spacing** uses a 4px base: 4, 8, 12, 16, 24, 32, 48, 64.

- Page padding 40px. Card padding 24px. Gap between cards 24px. Form field gap 20px.
- Table row 44px. Input and button height 40px. Dense variant: 36px, used only on explicit request.

**Radius:** 8px for controls (buttons, inputs, chips, menu items). 12px for containers (cards, panels, dialogs, command bar). Avatars are circular. No other radii.

**Depth** is built from tonal layers plus soft glow, never heavy shadow.

| Level | Used for | Treatment |
| --- | --- | --- |
| 0 | Canvas | `bg` |
| 1 | Cards, panels | `surface-1`, 1px `border-subtle` |
| 2 | Menus, popovers | `surface-3`, 1px `border-strong`, shadow `0 8px 24px rgba(0,0,0,0.6)` |
| 3 | Dialogs, command bar | `surface-3`, 1px `border-strong`, shadow `0 16px 48px rgba(0,0,0,0.7)`, glow `0 0 40px accent-glow` |

Focus is always visible: 1px `accent` border plus a 3px `accent-glow` ring.

## 5. Layout and navigation

- **Icon rail:** 56px wide, fixed left, `surface-1`. Icons 20px. Active item gets `accent-soft` fill and an accent icon. Tooltips after 400ms.
- **Flyout:** 240px panel opening beside the rail on hover or click, listing sub-sections. It overlays content at level 2 and closes on outside click or Escape.
- **Top bar:** 56px, holds breadcrumb, search/command trigger ("Ask or search, Cmd+K"), notifications, and profile.
- **Content:** fluid for tables, with a 960px max width for forms and detail views. Page titles at Title size with a one-line `text-secondary` description beneath.

## 6. The AI layer

**Command bar (Cmd+K).** This is the primary AI surface.

- Centered, 640px wide, 20% from the top, level 3, radius 12, with an accent glow. A dimmed `bg` scrim sits behind it.
- Sections: Ask, Go to, Actions, Recent. Keyboard-first, with visible shortcut hints.
- Responses stream in place, in `text-primary` on `surface-3`, with sources and linked records beneath.

**Marking AI content.** AI-generated or AI-initiated content carries a small accent spark icon and the label "Assistant". Human-authored content never does.

**Acting on the user's behalf.** Before any change is made, the assistant shows an action card: a plain-language summary, the records affected, the permissions used, and two buttons, "Approve" (primary) and "Decline" (secondary). Completed actions leave an entry in the activity log with who, what, when, and which records changed.

**Working state.** A 2px accent line animates across the top of the command bar while the assistant works. No bouncing dots, no theatrics.

## 7. Components

| Component | Specification |
| --- | --- |
| Primary button | `accent` fill, `on-accent` text, 8px radius, 500 weight. Hover: slight brightness increase. One per view area. |
| Secondary button | `surface-2` fill, `border-strong`, `text-primary`. |
| Ghost button | Transparent, `text-secondary`, hover `surface-hover`. |
| Destructive button | Outlined in `danger` on the page. Solid `danger` only inside the confirmation dialog. |
| Input | `surface-2`, `border-strong`, 40px. Label above in Label style, helper text below in Caption. Error: `danger` border plus message. |
| Table | No zebra striping. Hairline row dividers, hover `surface-hover`, selected `accent-soft`. Sticky header on `surface-2`. Numbers right-aligned, monospaced. |
| Chip / badge | 24px high, 8px radius, icon plus label, tones per the status table. |
| Card | `surface-1`, `border-subtle`, 12px radius, 24px padding. |
| Dialog | Level 3, 480px default width, title, body, actions right-aligned. Destructive dialogs name the exact record affected. |
| Toast | Bottom-right, level 2, auto-dismiss at 5s, errors persist until dismissed. |
| Empty state | Single line icon, one sentence, one action. No illustrations. |

## 8. Motion

- **Durations:** 150ms for hover and press, 200ms for menus, flyouts, and tabs, 250ms for dialogs and the command bar.
- **Easing:** `cubic-bezier(0.2, 0, 0, 1)`.
- Fade and small translate (8px max). No bounce, no spring, no parallax.
- Respect `prefers-reduced-motion`: replace movement with instant or fade-only transitions.

## 9. Voice and copy

Formal, precise, and neutral.

- Sentence case. No exclamation marks, emoji, or slang.
- Use specific verbs: "Approve payment", not "Okay". "Delete invoice INV-0412", not "Remove".
- Errors state what happened and what to do next: "The invoice could not be saved because the vendor field is empty. Enter a vendor and try again."
- The assistant speaks plainly in the first person, states uncertainty directly, and never over-apologizes.
- Dates as `03 Oct 2026`. Currency with symbol and grouping, e.g. `₹1,24,500.00`. Numbers tabular.

## 10. Accessibility and quality bar

- AA contrast minimum; interactive targets at least 40px.
- Every state has more than color to identify it.
- Full keyboard operation, logical tab order, visible focus.
- Screen reader labels on icon-only controls, including the whole rail.
- Every component ships with default, hover, focus, active, disabled, loading, and error states.