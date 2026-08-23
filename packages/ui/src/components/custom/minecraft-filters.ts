export interface FilterOption {
  key: string;
  label: string;
  options: readonly string[];
}

export interface ResourceSearch {
  q?: string;
  tags?: string[];
  [key: string]: string[] | string | undefined;
}

export const filterSections = [
  "builds",
  "configs",
  "graphics-textures",
  "models",
  "mods",
  "other",
  "plugins",
  "server-jars",
  "setups",
  "skripts",
] as const;

export type FilterSection = (typeof filterSections)[number];

export type FilterKey =
  | "category"
  | "minecraft_version"
  | "mod_loader"
  | "software"
  | "type";

export function normalizeList(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) {
    return value.map(String);
  }
  if (typeof value === "string") {
    return value.split(",").filter(Boolean);
  }
  return [];
}

/**
 * Restricts a search object to the filter keys valid for a section and drops
 * option values that the section no longer offers. Always keeps `q` and `tags`.
 */
export function sanitizeSearch(
  search: ResourceSearch,
  sectionFilters: readonly FilterOption[]
): ResourceSearch {
  const next: ResourceSearch = {};
  if (search.q) {
    next.q = search.q;
  }
  if (search.tags && search.tags.length > 0) {
    next.tags = search.tags;
  }
  for (const filter of sectionFilters) {
    const allowed = new Set(filter.options);
    const values = normalizeList(search[filter.key]).filter((value) =>
      allowed.has(value)
    );
    if (values.length > 0) {
      next[filter.key] = values;
    }
  }
  return next;
}

/**
 * All distinct filter keys used across every section.
 */
export const allFilterKeys = new Set<string>([
  "category",
  "minecraft_version",
  "mod_loader",
  "software",
  "type",
]);
