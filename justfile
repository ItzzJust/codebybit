set shell := ["bash", "-uc"]

# List all commands
default:
  @just --list

# Development ---------------------------------------------------------------
dev: # Start the dev server
  moon run :dev

build: # Build for production
  moon run :build

preview: # Preview the production build
  moon run :preview

# Quality --------------------------------------------------------------------
check: # Lint and format check
  pnpm run check

fix: # Auto-fix lint and format issues
  pnpm run fix

typecheck: # Type-check all workspaces
  moon run :typecheck

test: # Run the test suite
  moon run :test

test-watch: # Run tests in watch mode
  moon run :test-watch

# Database -------------------------------------------------------------------
db-generate: # Generate Drizzle migrations
  moon run web:db-generate

db-push: # Push the Drizzle schema to the database
  moon run web:db-push

db-migrate: # Apply database migrations
  moon run web:db-migrate

db-studio: # Open Drizzle Studio
  moon run web:db-studio

# Environment ----------------------------------------------------------------
install: # Install dependencies and toolchains
  mise install
  pnpm install

env: # Scaffold apps/web/.env.local from .env.example
  cp apps/web/.env.example apps/web/.env.local
