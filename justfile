set shell := ["bash", "-uc"]

# List all commands
default:
  @just --list

# Development ---------------------------------------------------------------
dev: # Start the dev server
  bun run dev

build: # Build for production
  bun run build

preview: # Preview the production build
  bun run preview

# Quality --------------------------------------------------------------------
check: # Lint and format check
  bun run check

fix: # Auto-fix lint and format issues
  bun run fix

typecheck: # Type-check all workspaces
  bun run typecheck

test: # Run the test suite
  bun run test

test-watch: # Run tests in watch mode
  bun run test:watch

# Database -------------------------------------------------------------------
db-generate: # Generate Drizzle migrations
  bun run db:generate

db-push: # Push the Drizzle schema to the database
  bun run db:push

db-migrate: # Apply database migrations
  bun run db:migrate

db-studio: # Open Drizzle Studio
  bun run db:studio

# Environment ----------------------------------------------------------------
install: # Install dependencies and toolchains
  mise install
  bun install

env: # Scaffold apps/web/.env.local from .env.example
  cp apps/web/.env.example apps/web/.env.local
