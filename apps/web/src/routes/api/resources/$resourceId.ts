import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { resource } from "@/db/schema";

export const Route = createFileRoute("/api/resources/$resourceId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const [row] = await db
          .select()
          .from(resource)
          .where(eq(resource.id, params.resourceId))
          .limit(1);

        if (!row) {
          return Response.json({ error: "Not found" }, { status: 404 });
        }

        return Response.json(row);
      },

      PUT: async ({ params, request }) => {
        const body = await request.json();
        const {
          title,
          description,
          price,
          section,
          category,
          tags,
          attributes,
        } = body as {
          title?: string;
          description?: string;
          price?: number;
          section?: string;
          category?: string;
          tags?: string[];
          attributes?: Record<string, string[]>;
        };

        const [row] = await db
          .update(resource)
          .set({
            ...(title !== undefined && { title }),
            ...(description !== undefined && { description }),
            ...(price !== undefined && { price }),
            ...(section !== undefined && { section }),
            ...(category !== undefined && { category }),
            ...(tags !== undefined && { tags }),
            ...(attributes !== undefined && { attributes }),
            updatedAt: new Date(),
          })
          .where(eq(resource.id, params.resourceId))
          .returning();

        if (!row) {
          return Response.json({ error: "Not found" }, { status: 404 });
        }

        return Response.json(row);
      },

      DELETE: async ({ params }) => {
        const [row] = await db
          .delete(resource)
          .where(eq(resource.id, params.resourceId))
          .returning();

        if (!row) {
          return Response.json({ error: "Not found" }, { status: 404 });
        }

        return Response.json({ success: true });
      },
    },
  },
});
