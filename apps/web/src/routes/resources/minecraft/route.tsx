import { MinecraftLayout } from "@codebybit/ui";
import {
  createFileRoute,
  Outlet,
  useRouterState,
} from "@tanstack/react-router";

import { FilterSidebar } from "@/components/minecraft/filter-sidebar";
import { allFilterKeys, normalizeList } from "@/components/minecraft/filters";
import type { ResourceSearch } from "@/components/minecraft/filters";

export const Route = createFileRoute("/resources/minecraft")({
  validateSearch: (search: Record<string, unknown>): ResourceSearch => {
    const result: ResourceSearch = {};

    if (typeof search.q === "string" && search.q.trim()) {
      result.q = search.q.trim();
    }

    const tags = normalizeList(search.tags as string[] | string | undefined);
    if (tags.length > 0) {
      result.tags = tags;
    }

    for (const key of allFilterKeys) {
      const values = normalizeList(
        search[key] as string[] | string | undefined
      );
      if (values.length > 0) {
        result[key] = values;
      }
    }

    return result;
  },
  component: MinecraftRoute,
});

function MinecraftRoute() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <MinecraftLayout pathname={pathname} sidebar={<FilterSidebar />}>
      <Outlet />
    </MinecraftLayout>
  );
}
