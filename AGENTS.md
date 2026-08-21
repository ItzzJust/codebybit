# CodeByBit

A marketplace for Minecraft digital resources (a BuiltByBit remake). Built with TanStack Start, React 19, Tailwind CSS v4, shadcn/ui (Base UI + BEUI), Drizzle ORM, and Better Auth, organized as a Turborepo monorepo.

## Repository layout

```
apps/web      TanStack Start web application
packages/     Shared packages (add as needed)
```

The web app lives in `apps/web`. Root-level `oxlint.config.ts` / `oxfmt.config.ts` configure linting and formatting for the whole repo.

## Getting started

Prerequisites: [mise](https://mise.jdx.dev) and [just](https://github.com/casey/just).

```sh
just install   # mise install + bun install
just env       # copy apps/web/.env.example -> apps/web/.env.local, then fill in values
just dev       # start the dev server on :3000
```

## Commands

Prefer `just`. Under the hood these run `bun run <script>`, which Turbo pipes to the correct workspace.

| Command | Description |
| --- | --- |
| `just dev` | Start the dev server on port 3000 |
| `just build` | Production build |
| `just preview` | Preview the production build |
| `just typecheck` | Type-check all workspaces |
| `just test` / `test-watch` | Run vitest |
| `just check` | Lint + format check |
| `just fix` | Auto-fix lint + format issues |
| `just db-generate` / `db-push` / `db-migrate` / `db-studio` | Drizzle commands |
| `just install` / `env` | Bootstrap dependencies and env |

Raw Turbo usage: `turbo run dev --filter=@codebybit/web`.

## Environment variables

Defined in `apps/web/.env.example`:

- `DATABASE_URL` — PostgreSQL connection string used by Drizzle
- `BETTER_AUTH_SECRET` — Better Auth signing secret (`openssl rand -base64 32`)
- `BETTER_AUTH_URL` — App base URL (`http://localhost:3000` in development)

## Stack notes

- **Router**: TanStack Router, file-based routing in `apps/web/src/routes`
- **Data**: Drizzle ORM + `postgres` client (`apps/web/src/db`)
- **Auth**: Better Auth (`apps/web/src/lib/auth.ts`, `auth-client.ts`)
- **UI**: shadcn/ui with Base UI + BEUI, shared in `packages/ui` (import `@codebybit/ui`), Tailwind v4
- **Path alias**: `@/*` → `apps/web/src/*` (configured in `apps/web/tsconfig.json` and Vite)

## AI tooling

- **MCP servers**: `shadcn` (component registry) and `beui` (https://mcp.beui.dev/mcp) are configured in `.opencode/opencode.json`
- **Agents**: OpenAgentsControl (meta-level profile) is installed under `.opencode/`

## Coding standards

Write code that is **accessible, performant, type-safe, and maintainable**. Focus on clarity and explicit intent over brevity.

### Type safety

- Explicit parameter/return types when they help clarity; prefer `unknown` over `any`
- Use `as const` for immutable literal types; prefer type narrowing over assertions
- Extract named constants instead of magic numbers

### JavaScript / TypeScript

- Arrow functions for callbacks; `for...of` over `.forEach()` and indexed loops
- Optional chaining (`?.`) and nullish coalescing (`??`); template literals over concatenation
- Destructuring for object/array assignment; `const` by default, `let` only for reassignment

### Async & promises

- Always `await` promises in async functions; use `async`/`await` over promise chains
- Handle errors meaningfully with `try`/`catch`; never use async functions as Promise executors

### React & JSX

- Function components; hooks at the top level; complete dependency arrays
- Unique `key` props (prefer IDs over array indices); semantic HTML + ARIA
- Keyboard handlers alongside mouse handlers; labelled inputs; proper heading hierarchy
- React 19+: pass `ref` as a prop instead of `React.forwardRef`
- Use `@unpic/react` for remote images

### Error handling & debugging

- No `console.log`, `debugger`, or `alert` in production code
- Throw `Error` objects with descriptive messages
- Early returns over nested conditionals

### Code organization

- Keep functions focused; extract complex conditions into named booleans
- Prefer simple conditionals over nested ternaries; group related code

### Security

- `rel="noopener"` on `target="_blank"` links; avoid `dangerouslySetInnerHTML`
- No `eval()`; validate and sanitize user input

### Performance

- No spread in loop accumulators; hoist regex literals
- Prefer specific imports over namespace/barrel imports

### Testing

- Assertions inside `it()`/`test()` blocks; use async/await (no done callbacks)
- No `.only`/`.skip` in committed code; keep suites reasonably flat

## Ultracite

Linting and formatting are handled by **Ultracite** (oxlint + oxfmt), configured at the repo root.

- `bun x ultracite fix` — auto-fix formatting and lint issues (also runs on pre-commit)
- `bun x ultracite check` — verify without modifying
- `bun x ultracite doctor` — diagnose the setup

Most issues are auto-fixable. Oxlint cannot judge business logic correctness, naming, architecture, edge cases, or UX — review those yourself.
