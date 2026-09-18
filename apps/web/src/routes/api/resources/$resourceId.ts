import { createFileRoute } from "@tanstack/react-router";

import { auth } from "@/lib/auth";
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

        const {
          attributes,
          category,
          description,
          price,
          section,
          tags,
          title,
        } = body as {
          attributes?: Record<string, string[]>;
          category?: string;
          description?: string;
          price?: number;
          section?: string;
          tags?: string[];
          title?: string;
        };

        const row = await resourceService.update(params.resourceId, {
          ...(attributes !== undefined && { attributes }),
          ...(category !== undefined && { category }),
          ...(description !== undefined && { description }),
          ...(price !== undefined && { price }),
          ...(section !== undefined && { section }),
          ...(tags !== undefined && { tags }),
          ...(title !== undefined && { title }),
        });

        return Response.json(row);
      },

      DELETE: async ({ params, request }) => {
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

        const row = await resourceService.delete(params.resourceId);

        return Response.json({ success: true });
      },
    },
  },
});
