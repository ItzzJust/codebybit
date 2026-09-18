import { createFileRoute } from "@tanstack/react-router";

import { auth } from "@/lib/auth";
import { resourceService } from "@/lib/resources";

export const Route = createFileRoute("/api/resources/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const section = url.searchParams.get("section") ?? undefined;
        const limit = Math.trunc(Number(url.searchParams.get("limit") ?? "50"));
        const offset = Math.trunc(
          Number(url.searchParams.get("offset") ?? "0")
        );

        const rows = await resourceService.list({ limit, offset, section });
        return Response.json(rows);
      },

      POST: async ({ request }) => {
        // Auth check
        const session = await auth.api.getSession({
          headers: Object.fromEntries(request.headers),
        });
        if (!session) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        const {
          attributes,
          category,
          description,
          id,
          price,
          section,
          tags,
          title,
        } = body as {
          attributes?: Record<string, string[]>;
          category?: string;
          description: string;
          id: string;
          price?: number;
          section: string;
          tags?: string[];
          title: string;
        };

        // Validate required fields
        const missingFields: string[] = [];
        if (!id) {
          missingFields.push("id");
        }
        if (!title) {
          missingFields.push("title");
        }
        if (!description) {
          missingFields.push("description");
        }
        if (!section) {
          missingFields.push("section");
        }

        if (missingFields.length > 0) {
          return Response.json(
            { error: `Missing required fields: ${missingFields.join(", ")}` },
            { status: 400 }
          );
        }

        // Use server-side session user ID — never trust client-provided authorId
        const row = await resourceService.create({
          attributes,
          authorId: session.user.id,
          category,
          description,
          id,
          price,
          section,
          tags,
          title,
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
