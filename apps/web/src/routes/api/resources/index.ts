import { createFileRoute } from "@tanstack/react-router";

import { auth } from "@/lib/auth";
import { isSameOrigin } from "@/lib/http-guards";
import { validateResourceInput } from "@/lib/resource-validation";
import { resourceService } from "@/lib/resources";

const DEFAULT_PAGE_LIMIT = 50;
const MAX_PAGE_LIMIT = 100;

function parsePageParam(value: string | null, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.trunc(parsed);
}

export const Route = createFileRoute("/api/resources/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const section = url.searchParams.get("section") ?? undefined;
        const limit = Math.min(
          Math.max(
            parsePageParam(url.searchParams.get("limit"), DEFAULT_PAGE_LIMIT),
            1
          ),
          MAX_PAGE_LIMIT
        );
        const offset = Math.max(
          parsePageParam(url.searchParams.get("offset"), 0),
          0
        );

        const rows = await resourceService.list({ limit, offset, section });
        return Response.json(rows);
      },

      POST: async ({ request }) => {
        // CSRF defense — reject cross-site state-changing requests.
        if (!isSameOrigin(request)) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }

        // Auth check
        const session = await auth.api.getSession({
          headers: Object.fromEntries(request.headers),
        });
        if (!session) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const result = validateResourceInput(body);
        if (!result.ok) {
          return Response.json({ error: result.error }, { status: 400 });
        }

        // Use server-side session user ID — never trust client-provided authorId
        const row = await resourceService.create({
          ...result.value,
          authorId: session.user.id,
        });

        if (!row) {
          return Response.json(
            { error: "A resource with this ID already exists" },
            { status: 409 }
          );
        }

        return Response.json(row, { status: 201 });
      },
    },
  },
});
