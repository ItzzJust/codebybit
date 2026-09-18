import { createServerFn } from "@tanstack/react-start";

import { resourceService } from "@/lib/resources";

/**
 * Server function: fetch a single resource by ID.
 * Called from route loaders — runs on the server only.
 */
export const getResource = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const row = await resourceService.getById(id);
    return row;
  });

/**
 * Server function: list resources by section.
 * Called from route loaders — runs on the server only.
 */
export const listResources = createServerFn({ method: "GET" })
  .validator(
    (params: { limit?: number; offset?: number; section?: string }) => params
  )
  .handler(async ({ data }) => {
    const rows = await resourceService.list(data);
    return rows;
  });
