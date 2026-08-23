# Style Guide

This document describes the coding conventions, formatting rules, and quality standards enforced across the CodeByBit monorepo.

---

## Tooling Overview

| Tool | Purpose | Config |
| --- | --- | --- |
| **Ultracite** | Unified lint + format orchestrator | Root `package.json` scripts |
| **OxLint** | Fast Rust-based linter | `oxlint.config.ts` |
| **OxFmt** | Rust-based formatter | `oxfmt.config.ts` |
| **TypeScript** | Static type checking | `tsconfig.base.json` |

Run all checks with:

```sh
just check    # lint + format (read-only)
just fix      # auto-fix lint + format issues
```

---

## TypeScript Rules

The project enforces `strict: true` via `tsconfig.base.json`. All workspaces extend this base config.

### Type Safety

- **No `any`** — use `unknown` and narrow with type guards
- **No `unknown` in function signatures** unless the input is truly untyped (e.g. `JSON.parse` return)
- **Explicit return types** on all exported functions
- **Explicit parameter types** on all exported functions
- **No implicit `any`** — every variable, parameter, and return must have a type
- **Use `as const`** for immutable literal types
- **Prefer type narrowing** over type assertions (`as`)

### Interfaces and Types

- **Define explicit interfaces** for all data structures and domain models
- **Export interfaces** that are used across files
- **Use `interface`** for object shapes; use `type` for unions, intersections, and mapped types
- **Name interfaces with nouns** (`ResourceCategory`, `FilterOption`)
- **Name types with nouns or adjectives** (`FilterSection`, `CategoryId`)

### Validation

- **Use Valibot** for all runtime validation (external input, URL params, API payloads)
- **Derive types from schemas** using `v.InferOutput<typeof Schema>` or `v.InferInput<typeof Schema>`
- **Never manually duplicate** the type that a schema already defines

```ts
import * as v from "valibot";

const ResourceSearchSchema = v.object({
  q: v.optional(v.pipe(v.string(), v.trim())),
  tags: v.optional(v.array(v.string())),
});

type ResourceSearch = v.InferOutput<typeof ResourceSearchSchema>;
```

### Strict Compiler Options

Enabled in `tsconfig.base.json`:

| Option                       | Value  |
| ---------------------------- | ------ |
| `strict`                     | `true` |
| `noUnusedLocals`             | `true` |
| `noUnusedParameters`         | `true` |
| `noFallthroughCasesInSwitch` | `true` |
| `noUncheckedIndexedAccess`   | `true` |
| `verbatimModuleSyntax`       | `true` |

---

## OxLint Rules

OxLint is configured in `oxlint.config.ts` using Ultracite's preset configs:

- **core** — general JavaScript best practices
- **react** — React-specific rules
- **tanstack** — TanStack Router/Query conventions
- **vitest** — Test quality rules
- **js-plugins** — `react-doctor` and `sonarjs` plugins

### Key Enforced Rules

| Rule | What it catches |
| --- | --- |
| `no-unused-vars` | Dead code |
| `no-console` | Accidental `console.log` in production |
| `eqeqeq` | Loose equality |
| `no-var` | `var` declarations |
| `react/jsx-key` | Missing `key` props |
| `react/self-closing-comp` | Unnecessary closing tags |
| `sonarjs/no-duplicate-string` | Repeated string literals |
| `react-doctor/rendering-svg-precision` | SVG precision issues |

### Ignored Patterns

These are excluded from linting because they are auto-generated:

- `packages/ui/**` — shadcn/ui components
- `**/components/motion/**` — BEUI motion components
- `.opencode/**` — AI tooling

### Rule Overrides

Some rules are disabled project-wide for practical reasons:

| Rule | Reason |
| --- | --- |
| `eslint/func-style` | shadcn/ui + BEUI generate `function` components |
| `jsx-a11y/prefer-tag-over-role` | shadcn input-otp uses `<div role="separator">` |
| `promise/prefer-await-to-callbacks` | Observer APIs require callbacks by design |
| `sonarjs/no-duplicate-string` | Filter data intentionally repeats labels |
| `sonarjs/no-wildcard-import` | shadcn components use wildcard imports |
| `sonarjs/pseudo-random` | `Math.random` used for image rotation, not security |

---

## OxFmt Rules

OxFmt is configured in `oxfmt.config.ts` using Ultracite's preset. It enforces:

### Formatting Standards

- **Indentation**: 2 spaces
- **Semicolons**: Always (no ASI)
- **Quotes**: Double quotes for strings
- **Trailing commas**: All (ES5+)
- **Print width**: 80 characters
- **Line endings**: LF (Unix)

### What OxFmt Handles

- Import ordering and grouping
- JSX formatting and alignment
- Object/array formatting
- Arrow function formatting
- Template literal formatting
- Chain expression formatting

### Ignored Patterns

- `.opencode/**` — AI tooling

---

## React & Component Rules

### Component Structure

```tsx
// ✅ Arrow function components (project convention)
export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  return <div>...</div>;
}

// ✅ Interface exported with component
export interface ComponentNameProps {
  prop1: string;
  prop2?: number;
}
```

### Hooks

- **Call hooks at the top level** — never inside conditions or loops
- **Complete dependency arrays** — no missing deps
- **Use `useCallback`/`useMemo`** only when there's a measurable perf need
- **Custom hooks** prefixed with `use` (`useRandomImage`, `useMinecraftVersions`)

### JSX

- **Self-closing tags** for elements without children
- **Semantic HTML** — use `<main>`, `<header>`, `<nav>`, `<section>` over `<div>`
- **ARIA attributes** on interactive elements
- **`key` prop** on all list items (never use array index)
- **`aria-hidden="true"`** on decorative SVGs

### Imports

```tsx
// ✅ Preferred order:
// 1. External packages
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

// 2. Internal UI components
import { Button } from "@codebybit/ui";

// 3. Local components/hooks
import { FilterSidebar } from "@/components/minecraft/filter-sidebar";

// 4. Types
import type { ResourceSearch } from "./filters";
```

---

## Naming Conventions

| Element | Convention | Example |
| --- | --- | --- |
| Files (components) | `kebab-case.tsx` | `category-card.tsx` |
| Files (hooks) | `kebab-case.ts` | `use-random-image.ts` |
| Files (utilities) | `kebab-case.ts` | `formatting.ts` |
| Components | `PascalCase` | `CategoryCard`, `ResourceList` |
| Hooks | `camelCase` (use prefix) | `useRandomImage` |
| Functions | `camelCase` | `getRandomImage`, `formatPrice` |
| Interfaces | `PascalCase` | `ResourceCategory`, `FilterOption` |
| Constants | `UPPER_SNAKE_CASE` | `SECTION_TITLES` |
| Route files | Match URL path | `resources/minecraft/plugins.tsx` |

---

## File Organization

### Route Files (`apps/web/src/routes/`)

```tsx
// 1. Imports
// 2. Route definition (exported)
// 3. Constants/data
// 4. Component (function declaration)
```

### Component Files (`packages/ui/src/`)

```tsx
// 1. Imports
// 2. Interfaces/types (exported)
// 3. Helper components (not exported)
// 4. Main component (exported)
```

### Hook Files (`apps/web/src/hooks/`)

```tsx
// 1. Imports
// 2. Constants
// 3. Hook function (exported)
```

---

## CSS & Tailwind Rules

### Class Ordering

Follow Tailwind's recommended order:

1. Layout (`flex`, `grid`, `block`)
2. Positioning (`relative`, `absolute`, `fixed`)
3. Box model (`w-`, `h-`, `p-`, `m-`)
4. Typography (`text-`, `font-`, `leading-`)
5. Visual (`bg-`, `border-`, `shadow-`)
6. Interactive (`hover:`, `focus:`, `active:`)

### Responsive Design

- **Mobile-first** — base styles for mobile, `sm:`, `md:`, `lg:`, `xl:` for larger
- **Test at breakpoints**: 375px, 768px, 1024px, 1440px
- **Touch targets**: minimum 44x44px

### Color Usage

- **Use theme variables** — `text-foreground`, `bg-muted`, `border-border`
- **Never hardcode colors** — use OKLCH values from the theme
- **Transparency** — use `/` syntax: `bg-primary/10`, `text-muted-foreground`

---

## Git Workflow

### Commit Messages

Follow conventional commits:

```
feat: add resource search filter
fix: center hero section on ultrawide
refactor: extract ResourcePageLayout component
docs: update style guide
chore: update dependencies
```

### Pre-commit

Ultracite runs automatically on pre-commit via git hooks:

- `oxlint` — lint check
- `oxfmt` — format check

If the hook fails, run `just fix` and re-commit.

---

## Common Patterns

### Page Layout

```tsx
// Resource pages use ResourcePageLayout
import { ResourcePageLayout, PageHeader, CategoryCard } from "@codebybit/ui";

function ResourcesPage() {
  return (
    <ResourcePageLayout>
      <PageHeader badge="Category" title="Title" description="Description" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* cards */}
      </div>
    </ResourcePageLayout>
  );
}
```

### Client-side Navigation

```tsx
// ✅ Use TanStack Router Link
import { Link } from "@tanstack/react-router";

<Link to="/resources/minecraft">Minecraft</Link>

// ❌ Never use <a href> for internal navigation
<a href="/resources/minecraft">Minecraft</a>
```

### Image Handling

```tsx
// Use @unpic/react for optimized images
import { Image } from "@unpic/react";

<Image src={src} alt="Description" width={400} height={300} />

// Decorative images use <img> with aria-hidden
<img src={src} alt="" aria-hidden="true" />
```
