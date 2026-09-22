import { createFileRoute } from "@tanstack/react-router";

import { auth } from "@/lib/auth";
import { isSameOrigin } from "@/lib/http-guards";
import { validateResourceUpdate } from "@/lib/resource-validation";
import { resourceService } from "@/lib/resources";

export const Route = createFileRoute("/api/resources/$resourceId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const row = await resourceService.getById(params.resourceId);

        if (!row) {
          return Response.json({ error: "Not found" }, { status: 404 });
        }

        return Response.json(row);
      },

      PUT: async ({ params, request }) => {
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

        const existing = await resourceService.getById(params.resourceId);
        if (!existing) {
          return Response.json({ error: "Not found" }, { status: 404 });
        }

        // Ownership check
        if (existing.authorId !== session.user.id) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const result = validateResourceUpdate(body);
        if (!result.ok) {
          return Response.json({ error: result.error }, { status: 400 });
        }

        const row = await resourceService.update(
          params.resourceId,
          result.value
        );

        return Response.json(row);
      },

      DELETE: async ({ params, request }) => {
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

        const existing = await resourceService.getById(params.resourceId);
        if (!existing) {
          return Response.json({ error: "Not found" }, { status: 404 });
        }

        // Ownership check
        if (existing.authorId !== session.user.id) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }

        await resourceService.delete(params.resourceId);

        return Response.json({ success: true });
      },
    },
  },
});
