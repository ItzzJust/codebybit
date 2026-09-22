# syntax=docker/dockerfile:1

# ── Base ─────────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# ── Dependencies ─────────────────────────────────────────────────────────
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY apps/web/package.json apps/web/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN pnpm install --frozen-lockfile

# ── Builder ──────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY . .
# Dummy env so module-level env validation (src/env.ts) never crashes the build.
ENV DATABASE_URL="postgres://user:pass@localhost:5432/db"
ENV BETTER_AUTH_SECRET="build-only-secret-build-only-secret"
ENV BETTER_AUTH_URL="http://localhost:3000"
RUN pnpm --filter @codebybit/web build

# ── Runner ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nodejs
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY apps/web/package.json apps/web/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
# Drop dev dependencies so the runtime image only ships production code.
RUN pnpm prune --prod
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/apps/web/server.mjs ./server.mjs
USER nodejs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.mjs"]