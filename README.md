# CodeByBit

A marketplace for Minecraft digital resources — a [BuiltByBit](https://builtbybit.com) remake. Buy and sell plugins, skripts, builds, mods, setups, graphics, and more.

![TanStack Start](https://img.shields.io/badge/TanStack_Start-black?logo=react&logoColor=61DAFB) ![React 19](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) ![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white) ![Bun](https://img.shields.io/badge/Bun-F9F1E1?logo=bun&logoColor=black) ![Moonrepo](https://img.shields.io/badge/Moonrepo-6D5CFF?logo=moonrepo&logoColor=white)

## Documentation

| Document | Description |
| --- | --- |
| [README](./README.md) | Project overview, setup, and tech stack |
| [Style Guide](./STYLEGUIDE.md) | Coding conventions, lint rules, TypeScript standards |
| [Contributing Guide](./CONTRIBUTING.md) | How to contribute, workflow, and important files |
| [Agent Instructions](./AGENTS.md) | AI agent coding standards and instructions |

## Features

- **Resource marketplace** — browse Minecraft resources by category (plugins, skripts, builds, mods, setups, server jars, configs, models, graphics/textures) plus websites, Discord, and Roblox sections
- **Authentication** — email/password login and registration via Better Auth
- **Resource discovery** — filters, tags, version support, and search
- **Resource detail pages** — dedicated pages per resource
- **Command menu** — `⌘K` palette for fast navigation
- **Dark theme** — first-class dark mode support
- **Responsive design** — mobile-first layouts throughout
- **Error boundaries** — graceful failure handling at the route level
- **OG image generation** — dynamic social preview images via satori

## Tech stack

| Layer           | Technology                              |
| --------------- | --------------------------------------- |
| Framework       | TanStack Start (TanStack Router + Vite) |
| UI runtime      | React 19                                |
| Styling         | Tailwind CSS v4                         |
| Components      | shadcn/ui with Base UI + BEUI           |
| Animation       | motion/react (`LazyMotion`)             |
| Icons           | Lucide React + GravityUI Icons          |
| Database        | PostgreSQL + Drizzle ORM                |
| Auth            | Better Auth                             |
| Validation      | Valibot                                 |
| Lint/format     | Ultracite (oxlint + oxfmt)              |
| Testing         | Vitest + Testing Library                |
| Package manager | Bun                                     |
| Task runner     | Just + Moonrepo                         |
| Toolchains      | mise                                    |

## Project structure

```
builtbybit-remake/
├── apps/
│   └── web/              # TanStack Start web application (@codebybit/web)
│       └── src/
│           ├── db/       # Drizzle schema + client
│           ├── lib/      # Auth, env, utilities
│           └── routes/   # File-based routes
├── packages/
│   └── ui/               # Shared UI library (@codebybit/ui)
├── justfile              # Task runner recipes
├── mise.toml             # Tool versions (bun, node)
└── .moon/                # Moonrepo configuration
```

## Getting started

### Prerequisites

- [mise](https://mise.jdx.dev) — tool version management
- [just](https://github.com/casey/just) — command runner
- A PostgreSQL database

### Setup

```sh
# 1. Install toolchains + dependencies
just install

# 2. Scaffold environment variables
just env
```

Then fill in `apps/web/.env.local`:

```sh
DATABASE_URL=postgres://user:password@localhost:5432/codebybit
BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
```

```sh
# 3. Push the schema and start developing
just db-push
just dev
```

The app runs at **http://localhost:3000**.

## Commands

Prefer `just`. Under the hood these run `moon run`, which pipes to the correct workspace.

| Command            | Description                                    |
| ------------------ | ---------------------------------------------- |
| `just install`     | Install toolchains (mise) + dependencies (bun) |
| `just env`         | Copy `.env.example` → `apps/web/.env.local`    |
| `just dev`         | Start the dev server on port 3000              |
| `just build`       | Production build                               |
| `just preview`     | Preview the production build                   |
| `just typecheck`   | Type-check all workspaces                      |
| `just test`        | Run the test suite                             |
| `just test-watch`  | Run tests in watch mode                        |
| `just check`       | Lint + format check                            |
| `just fix`         | Auto-fix lint + format issues                  |
| `just db-generate` | Generate Drizzle migrations                    |
| `just db-push`     | Push the Drizzle schema to the database        |
| `just db-migrate`  | Apply database migrations                      |
| `just db-studio`   | Open Drizzle Studio                            |

Raw Moon usage: `moon run web:dev`.

## Database

Schema lives in `apps/web/src/db/schema.ts`, managed with Drizzle Kit.

```sh
# Edit apps/web/src/db/schema.ts, then:
just db-generate   # create migration files
just db-migrate    # apply them
just db-studio     # inspect data visually
```

Use `db-push` for rapid prototyping when migration history doesn't matter yet.

## UI library

Shared components live in `packages/ui` and are imported as `@codebybit/ui`:

```tsx
import { Button } from "@codebybit/ui";
```

To add new shadcn/ui components, run from the repo root:

```sh
npx shadcn@latest add button
```

Components land in `packages/ui/src/components`.

## Path aliases

`@/*` maps to `apps/web/src/*` (configured in `apps/web/tsconfig.json` and Vite):

```ts
import { auth } from "@/lib/auth";
```

## Linting & formatting

[Ultracite](https://ultracite.dev) (oxlint + oxfmt) handles both, configured at the repo root via `oxlint.config.ts` / `oxfmt.config.ts`.

```sh
just fix      # auto-fix (also runs on pre-commit)
just check    # verify without modifying
```

Most issues are auto-fixable. Oxlint can't judge business logic, naming, architecture, edge cases, or UX — review those yourself.

See [STYLEGUIDE.md](./STYLEGUIDE.md) for detailed lint rules and coding conventions.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup instructions, workflow, and how to submit changes.
