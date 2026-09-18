import { eq, desc } from "drizzle-orm";

import { db } from "@/db";
import { resource } from "@/db/schema";
import { cache } from "@/lib/cache";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CreateResourceInput {
  attributes?: Record<string, string[]>;
  authorId: string;
  category?: string;
  description: string;
  id: string;
  price?: number;
  section: string;
  tags?: string[];
  title: string;
}

export type UpdateResourceInput = Partial<
  Omit<CreateResourceInput, "authorId" | "id">
>;

export interface ResourceQueryParams {
  limit?: number;
  offset?: number;
  section?: string;
}

// ---------------------------------------------------------------------------
// Cache keys
// ---------------------------------------------------------------------------

function listCacheKey(
  section?: string,
  limit?: number,
  offset?: number
): string {
  return `resources:list:${section ?? "all"}:${limit ?? 50}:${offset ?? 0}`;
}

function detailCacheKey(id: string): string {
  return `resources:detail:${id}`;
}

// Cache TTL in seconds (1 minute)
const CACHE_TTL = 60;

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const resourceService = {
  /**
   * Create a new resource.
   * Returns null if a resource with the same ID already exists.
   */
  async create(input: CreateResourceInput) {
    // Prevent duplicate IDs
    const existing = await this.getById(input.id);
    if (existing) {
      return null;
    }

    const now = new Date();

    const [row] = await db
      .insert(resource)
      .values({
        attributes: input.attributes ?? {},
        authorId: input.authorId,
        category: input.category ?? null,
        createdAt: now,
        description: input.description,
        downloads: 0,
        id: input.id,
        price: input.price ?? 0,
        section: input.section,
        tags: input.tags ?? [],
        title: input.title,
        updatedAt: now,
      })
      .returning();

    // Invalidate list caches for this section
    await cache.delPattern(`resources:list:${input.section}:*`);

    return row;
  },

  /**
   * Delete a resource by ID.
   * Invalidates both list and detail caches.
   */
  async delete(id: string) {
    const row = await this.getById(id);
    if (!row) {
      return null;
    }

    await db.delete(resource).where(eq(resource.id, id));

    // Invalidate caches
    await cache.del(detailCacheKey(id));
    await cache.delPattern(`resources:list:${row.section}:*`);

    return row;
  },

  /**
   * Get a single resource by ID.
   * Results are cached for 60 seconds.
   */
  getById(id: string) {
    return cache.getOrSet(
      detailCacheKey(id),
      async () => {
        const [row] = await db
          .select()
          .from(resource)
          .where(eq(resource.id, id))
          .limit(1);

        return row ?? null;
      },
      { ttl: CACHE_TTL }
    );
  },

  /**
   * List resources with optional section filter.
   * Results are cached for 60 seconds.
   */
  list(params: ResourceQueryParams = {}) {
    const { section, limit = 50, offset = 0 } = params;

    return cache.getOrSet(
      listCacheKey(section, limit, offset),
      async () => {
        const where = section ? eq(resource.section, section) : undefined;

        const rows = await db
          .select()
          .from(resource)
          .where(where)
          .orderBy(desc(resource.createdAt))
          .limit(limit)
          .offset(offset);

        return rows;
      },
      { ttl: CACHE_TTL }
    );
  },

  /**
   * Update a resource by ID.
   * Returns null if the resource doesn't exist.
   * Invalidates both list and detail caches.
   */
  async update(id: string, fields: UpdateResourceInput) {
    const existing = await this.getById(id);
    if (!existing) {
      return null;
    }

    const now = new Date();

    const [row] = await db
      .update(resource)
      .set({
        ...(fields.attributes !== undefined && {
          attributes: fields.attributes,
        }),
        ...(fields.category !== undefined && { category: fields.category }),
        ...(fields.description !== undefined && {
          description: fields.description,
        }),
        ...(fields.price !== undefined && { price: fields.price }),
        ...(fields.section !== undefined && { section: fields.section }),
        ...(fields.tags !== undefined && { tags: fields.tags }),
        ...(fields.title !== undefined && { title: fields.title }),
        updatedAt: now,
      })
      .where(eq(resource.id, id))
      .returning();

    // Invalidate caches
    await cache.del(detailCacheKey(id));
    await cache.delPattern(`resources:list:${existing.section}:*`);
    // If section changed, also invalidate the new section's cache
    if (fields.section && fields.section !== existing.section) {
      await cache.delPattern(`resources:list:${fields.section}:*`);
    }

    return row;
  },
};
