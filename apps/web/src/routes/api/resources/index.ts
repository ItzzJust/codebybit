import { createFileRoute } from "@tanstack/react-router";
import { eq, desc } from "drizzle-orm";

import { db } from "@/db";
import { resource } from "@/db/schema";

export const Route = createFileRoute("/api/resources")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const section = url.searchParams.get("section");
        const limit = Math.trunc(Number(url.searchParams.get("limit") ?? "50"));
        const offset = Math.trunc(
          Number(url.searchParams.get("offset") ?? "0")
        );

        const where = section ? eq(resource.section, section) : undefined;

        const rows = await db
          .select()
          .from(resource)
          .where(where)
          .orderBy(desc(resource.createdAt))
          .limit(limit)
          .offset(offset);

        return Response.json(rows);
      },

      POST: async ({ request }) => {
        const body = await request.json();

        const {
          id,
          title,
          description,
          price,
          section,
          category,
          authorId,
          tags,
          attributes,
        } = body as {
          id: string;
          title: string;
          description: string;
          price: number;
          section: string;
          category?: string;
          authorId: string;
          tags?: string[];
          attributes?: Record<string, string[]>;
        };

        if (!id || !title || !description || !section || !authorId) {
          return Response.json(
            { error: "Missing required fields" },
            { status: 400 }
          );
        }

        const now = new Date();

        const [row] = await db
          .insert(resource)
          .values({
            id,
            title,
            description,
            price: price ?? 0,
            section,
            category: category ?? null,
            authorId,
            downloads: 0,
            tags: tags ?? [],
            attributes: attributes ?? {},
            createdAt: now,
            updatedAt: now,
          })
          .returning();

        return Response.json(row, { status: 201 });
      },
    },
  },
});
