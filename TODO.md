# TODO List

## High Priority

- [ ] **Fix `resourceService.create()` used for PUT updates** — `apps/web/src/routes/api/resources/$resourceId.ts` calls `resourceService.create()` on PUT, which inserts a new row instead of updating. Add an `update()` method to `apps/web/src/lib/resources.ts` using `db.update()` and invalidate the detail + list caches.
- [ ] **Add `username` column to Drizzle schema** — Better Auth's `username` plugin is enabled in `apps/web/src/lib/auth.ts`, but `apps/web/src/db/schema.ts` has no `username` field on the `user` table. Verify whether the plugin auto-manages it via the adapter; if not, add the column and run `just db-generate` + `just db-push`.
- [ ] **Set `REDIS_URL` in `.env.local`** — Redis/Valkey caching (`apps/web/src/lib/cache.ts`) silently degrades without it. Add the variable to `.env.local` and to `apps/web/src/env.ts` validation (currently optional).
- [ ] **Fix pre-existing typecheck error** — `just typecheck` fails with TS6306/TS6310: `apps/web/tsconfig.json` has `references` to `packages/ui` without `composite: true`. Add `composite: true` to `packages/ui/tsconfig.json` (or remove the reference).
- [ ] **End-to-end test auth flows** — Sign-up was never browser-tested. Verify: register → login (email) → login (username) → logout → resource creation → resource detail page.

## Medium Priority

- [ ] **Fix lint warnings in `$resourceId.tsx`** — Pre-existing issues: `react(todo)` TryStatement with `finally`, `anti-slop(no-known-value-widening)` on `SECTION_LABELS`, `react-doctor(no-giant-component)` (component >300 lines), `tanstack-start-no-useeffect-fetch`, `only-export-components`.
- [ ] **Fix lint warnings in `resource-list.tsx`** — `react(todo)` TryStatement, `no-nested-ternary`, `no-transition-all`, `no-tiny-text` (11px), `require-safety-comment-for-type-assertion`, `sonarjs(no-nested-conditional)`.
- [ ] **Fix lint warnings in `filter-sidebar.tsx`** — `no-runtime-typeof`, `prefer-use-effect-event`, `require-safety-comment-for-type-assertion`, `no-tiny-text` (10px/11px).
- [ ] **Fix lint warnings in `minecraft-versions.ts`** — `unicorn(no-array-sort)` (use `toSorted()`), `sonarjs(max-union-size)` (union >3 elements).
- [ ] **Fix `only-export-components` warnings** — Affects most route files (`login.tsx`, `plugins.tsx`, `mods.tsx`, `route.tsx`, `tos.tsx`, etc.). Fast Refresh can't preserve local components.
- [ ] **Fix `anti-slop` warnings in `minecraft/route.tsx`** — `no-unsafe-dictionary-type`, `no-runtime-typeof`, `require-safety-comment-for-type-assertion`.
- [ ] **Fix `anti-slop` warnings in `index.tsx`** — `no-known-value-widening` on `imageMap`, `require-safety-comment-for-type-assertion`.

## Features / Enhancements

- [ ] **Resource editing UI** — Add an edit page for resource authors (PUT endpoint exists but no UI).
- [ ] **Resource deletion UI** — Add delete button/confirmation for resource authors (DELETE endpoint exists but no UI).
- [ ] **User profiles** — `/users/$username` page showing resources, join date, stats.
- [ ] **Download tracking** — Increment `downloads` counter when a user downloads a resource.
- [ ] **Search** — Global search across resources (title, description, tags) with debounced results.
- [ ] **Selling resources** — Enable the price field in `/resources/new` and add purchase/checkout flow.
- [ ] **Resource versions** — Support multiple versions/files per resource with changelogs.
- [ ] **Reviews & ratings** — Allow users to rate and review resources.
- [ ] **Admin panel** — Moderate resources, manage users, view analytics.
- [ ] **Email verification** — Wire up Better Auth email verification flow.
- [ ] **Password reset** — Wire up Better Auth forgot-password flow.
- [ ] **OAuth providers** — Add Google/GitHub/Discord sign-in.
- [ ] **Pagination on resource lists** — Currently capped at 100 via API limit; add proper pagination UI.
- [ ] **Roblox/Discord/Websites category pages** — Only Minecraft has subcategory pages; add equivalents for other platforms.
- [ ] **OG image generation** — `apps/web/src/routes/api/og.tsx` exists; wire it into resource detail pages.

## Infrastructure / Cleanup

- [ ] **Add `REDIS_URL` to `.env.example`** — Document the optional caching variable.
- [ ] **Commit uncommitted work** — Many modified/untracked files exist (see `git status`): auth changes, resource service, cache, legal pages, new routes, sonner toasts.
- [ ] **Remove `console.error` in `cache.ts`** — Replace with proper logging or silent failure to match the rest of the file.
- [ ] **Verify `username` plugin DB migration** — Confirm the `username` column exists after `db-push`; test login with username `test`.
- [ ] **Test Redis caching** — With `REDIS_URL` set, verify list/detail caching works and invalidates on create/delete.
- [ ] **Add tests** — Vitest is configured; add unit tests for `resourceService` and `cache`, plus component tests for auth forms.
