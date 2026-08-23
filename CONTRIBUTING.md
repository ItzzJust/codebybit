# Contributing to CodeByBit

Thank you for your interest in contributing to CodeByBit! This guide covers everything you need to get started.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Code Quality](#code-quality)
- [Submitting Changes](#submitting-changes)
- [Important Files](#important-files)

---

## Prerequisites

- [mise](https://mise.jdx.dev) — tool version management (installs correct Bun/Node versions)
- [just](https://github.com/casey/just) — command runner
- A PostgreSQL database (for full-stack features)

## Getting Started

```sh
# 1. Clone the repository
git clone https://github.com/ArexLabs/codebybit.git
cd codebybit

# 2. Install toolchains + dependencies
just install

# 3. Scaffold environment variables
just env
# Then edit apps/web/.env.local with your database URL

# 4. Push the schema and start developing
just db-push
just dev
```

The app runs at **[http://localhost:3000](http://localhost:3000)**.

---

## Project Structure

```tree
builtbybit-remake/
├── apps/
│   └── web/                  # TanStack Start web app (@codebybit/web)
│       └── src/
│           ├── components/   # App-specific components
│           ├── data/         # Static data (categories, resources)
│           ├── db/           # Drizzle schema + client
│           ├── hooks/        # Custom React hooks
│           ├── lib/          # Utilities, auth, SEO
│           └── routes/       # File-based routes (TanStack Router)
├── packages/
│   └── ui/                   # Shared UI library (@codebybit/ui)
│       └── src/
│           ├── components/   # shadcn/ui + custom components
│           ├── hooks/        # Shared hooks
│           ├── lib/          # Utilities (cn, etc.)
│           └── sections/     # Page-level layout components
├── oxlint.config.ts          # OxLint configuration
├── oxfmt.config.ts           # OxFmt configuration
├── tsconfig.base.json        # Shared TypeScript config
├── justfile                  # Task runner recipes
├── mise.toml                 # Tool versions
└── turbo.json                # Turborepo pipeline
```

---

## Development Workflow

### Available Commands

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `just dev`       | Start the dev server on port 3000 |
| `just build`     | Production build                  |
| `just typecheck` | Type-check all workspaces         |
| `just test`      | Run the test suite                |
| `just check`     | Lint + format check (read-only)   |
| `just fix`       | Auto-fix lint + format issues     |

### Making Changes

1. **Create a branch** from `main`
2. **Make your changes** following the code style
3. **Run `just check`** to verify lint/format
4. **Run `just typecheck`** to verify types
5. **Run `just test`** to verify tests pass
6. **Commit** with a conventional commit message

### Adding Components

To add a new shadcn/ui component:

```sh
# From the repo root
npx shadcn@latest add button
```

Components land in `packages/ui/src/components/ui/`.

To add a custom shared component, create it in `packages/ui/src/components/custom/` and export it from `packages/ui/src/index.ts`.

### Adding Routes

Routes are file-based using TanStack Router. Create a file in `apps/web/src/routes/`:

```tsx
// apps/web/src/routes/resources/minecraft/plugins.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/resources/minecraft/plugins")({
  component: PluginsPage,
});

function PluginsPage() {
  return <div>Plugins</div>;
}
```

---

## Code Quality

This project enforces strict code quality standards. **Read [STYLEGUIDE.md](./STYLEGUIDE.md) before contributing.**

### Quick Rules

- **TypeScript strict mode** — no `any`, explicit types on everything
- **Valibot** for runtime validation — derive types from schemas
- **OxLint** for linting — run `just check` before committing
- **OxFmt** for formatting — run `just fix` to auto-fix
- **React 19** patterns — function components, hooks, semantic HTML

### Pre-commit Checks

Ultracite runs automatically on pre-commit:

- `oxlint` — lint check
- `oxfmt` — format check

If the hook fails, run `just fix` and re-commit.

---

## Submitting Changes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add resource search filter
fix: center hero section on ultrawide
refactor: extract ResourcePageLayout component
docs: update style guide
chore: update dependencies
```

### Pull Request Checklist

- [ ] Code follows the [Style Guide](./STYLEGUIDE.md)
- [ ] `just check` passes (lint + format)
- [ ] `just typecheck` passes
- [ ] `just test` passes
- [ ] New components are exported from `packages/ui/src/index.ts`
- [ ] Routes use TanStack Router `<Link>` (not `<a href>`)
- [ ] No `console.log` or `debugger` in production code
- [ ] Commit messages follow conventional commits

---

## Important Files

| File | Purpose |
| --- | --- |
| [`STYLEGUIDE.md`](./STYLEGUIDE.md) | Coding conventions, lint rules, TypeScript standards |
| [`README.md`](./README.md) | Project overview, setup, tech stack |
| [`AGENTS.md`](./AGENTS.md) | AI agent instructions and coding standards |
| [`tsconfig.base.json`](./tsconfig.base.json) | Shared TypeScript compiler options |
| [`oxlint.config.ts`](./oxlint.config.ts) | OxLint rule configuration |
| [`oxfmt.config.ts`](./oxfmt.config.ts) | OxFmt formatting configuration |
| [`justfile`](./justfile) | Task runner recipes |
| [`mise.toml`](./mise.toml) | Tool version management |
| [`turbo.json`](./turbo.json) | Turborepo pipeline configuration |
| [`packages/ui/src/index.ts`](./packages/ui/src/index.ts) | Shared component exports |

---

## Getting Help

- Check the [README](./README.md) for setup instructions
- Read the [Style Guide](./STYLEGUIDE.md) for coding conventions
- Look at existing code for patterns and examples
- Run `just check` and `just typecheck` to diagnose issues
