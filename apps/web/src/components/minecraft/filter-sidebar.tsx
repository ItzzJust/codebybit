import {
  Badge,
  Checkbox,
  Input,
  MultiSelectCombobox,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@codebybit/ui";
import { useNavigate, useRouterState, useSearch } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useMinecraftVersions } from "@/hooks/use-minecraft-versions";

import {
  filters,
  getActiveSection,
  normalizeList,
  sanitizeSearch,
} from "./filters";
import type { FilterOption, ResourceSearch } from "./filters";

const tagSuggestions = [
  "official",
  "updated",
  "featured",
  "popular",
  "beginner-friendly",
  "performance",
  "optimization",
  "survival",
  "skyblock",
  "minigame",
  "pvp",
  "vanilla",
  "community",
  "open-source",
  "lightweight",
  "experimental",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toList(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string") {
    return [value];
  }
  return [];
}

function searchEquals(a: ResourceSearch, b: ResourceSearch): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    const aList = toList(a[key]);
    const bList = toList(b[key]);
    if (aList.length !== bList.length) {
      return false;
    }
    if (!aList.every((v, i) => v === bList[i])) {
      return false;
    }
  }
  return true;
}

// ---------------------------------------------------------------------------
// SearchInput
// ---------------------------------------------------------------------------

function SearchInput() {
  const search = useSearch({ strict: false }) as ResourceSearch;
  const navigate = useNavigate();
  const query = search.q ?? "";
  const [draft, setDraft] = useState("");
  const [active, setActive] = useState(false);
  const value = active ? draft : query;

  const setQuery = useCallback(
    (newValue: string | null) => {
      navigate({
        replace: true,
        search: (prev: ResourceSearch) => {
          const next: ResourceSearch = {};
          if (newValue) {
            next.q = newValue;
          }
          if (prev.tags && prev.tags.length > 0) {
            next.tags = prev.tags;
          }
          for (const key of Object.keys(prev)) {
            if (key !== "q" && key !== "tags") {
              next[key] = prev[key];
            }
          }
          return next;
        },
        to: ".",
      });
    },
    [navigate]
  );

  useEffect(() => {
    if (!active) {
      return;
    }
    const timer = setTimeout(() => {
      setQuery(draft || null);
      setActive(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [active, draft, setQuery]);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="px-2">
        <div className="relative">
          <label htmlFor="filter-search" className="sr-only">
            Search resources
          </label>
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input
            id="filter-search"
            type="search"
            value={value}
            onChange={(e) => {
              setDraft(e.target.value);
              setActive(true);
            }}
            placeholder="Search resources..."
            className="bg-sidebar-accent/50 border-sidebar-border focus-visible:ring-sidebar-ring h-8 pr-3 pl-8 text-xs"
          />
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// ---------------------------------------------------------------------------
// TagsFilter
// ---------------------------------------------------------------------------

function TagsFilter() {
  const search = useSearch({ strict: false }) as ResourceSearch;
  const navigate = useNavigate();
  const tags = normalizeList(search.tags);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const setTags = (nextTags: string[] | null) => {
    navigate({
      replace: true,
      search: (prev: ResourceSearch) => {
        const next: ResourceSearch = { q: prev.q };
        if (nextTags && nextTags.length > 0) {
          next.tags = nextTags;
        }
        for (const key of Object.keys(prev)) {
          if (key !== "q" && key !== "tags") {
            next[key] = prev[key];
          }
        }
        return next;
      },
      to: ".",
    });
  };

  const suggestions = useMemo(() => {
    const query = input.trim().toLowerCase();
    return tagSuggestions
      .filter((tag) => !tags.includes(tag))
      .filter((tag) => !query || tag.toLowerCase().includes(query))
      .slice(0, 5);
  }, [input, tags]);

  const addTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase();
    if (!normalized || tags.includes(normalized)) {
      return;
    }
    setTags([...tags, normalized]);
    setInput("");
    setIsOpen(false);
  };

  const removeTag = (tag: string) => {
    const next = tags.filter((t) => t !== tag);
    setTags(next.length > 0 ? next : null);
  };

  return (
    <SidebarGroup>
      <div className="flex items-center justify-between px-2 py-1">
        <SidebarGroupLabel className="text-muted-foreground p-0 text-xs font-medium tracking-wide uppercase">
          Tags
        </SidebarGroupLabel>
        {tags.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setTags(null);
              setInput("");
            }}
            className="text-muted-foreground hover:text-foreground text-[11px] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <SidebarGroupContent className="space-y-2 px-2">
        <div className="relative">
          <label htmlFor="filter-tags" className="sr-only">
            Filter tags
          </label>
          <Input
            id="filter-tags"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                e.preventDefault();
                addTag(input);
              }
              if (e.key === "Escape") {
                setIsOpen(false);
              }
            }}
            placeholder="Search or add tags..."
            className="bg-sidebar-accent/50 border-sidebar-border focus-visible:ring-sidebar-ring h-8 text-xs"
          />

          {isOpen && (suggestions.length > 0 || input.trim()) && (
            <div className="border-popover-border bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 absolute top-full right-0 left-0 z-50 mt-1 rounded-md border shadow-md outline-none">
              <div className="p-1">
                {suggestions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      addTag(tag);
                    }}
                    className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-xs transition-colors"
                  >
                    {tag}
                  </button>
                ))}
                {input.trim() &&
                  !tagSuggestions.includes(input.trim().toLowerCase()) &&
                  !tags.includes(input.trim().toLowerCase()) && (
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addTag(input);
                      }}
                      className="hover:bg-accent hover:text-accent-foreground border-border/50 mt-1 flex w-full cursor-pointer items-center rounded-sm border-t px-2 pt-1.5 text-left text-xs transition-colors"
                    >
                      <span className="text-muted-foreground mr-1">
                        Add custom tag:
                      </span>
                      <span className="font-semibold">{input.trim()}</span>
                    </button>
                  )}
              </div>
            </div>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="border-border/50 bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 h-6 gap-1 border px-2 text-[11px] font-normal transition-colors"
              >
                <span className="max-w-[110px] truncate">{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-muted-foreground hover:text-foreground rounded-full transition-colors"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// ---------------------------------------------------------------------------
// VersionFilter — MultiSelectCombobox with live Mojang versions
// ---------------------------------------------------------------------------

function VersionFilter({
  selected,
  onToggle,
}: {
  selected: readonly string[];
  onToggle: (values: string[]) => void;
}) {
  const { versions, isLoading, error } = useMinecraftVersions();

  const options = useMemo(
    () => versions.map((v) => ({ label: v, value: v })),
    [versions]
  );

  if (error) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="px-2 text-xs font-medium tracking-wide uppercase">
          Minecraft Version
        </SidebarGroupLabel>
        <SidebarGroupContent className="px-2">
          <p className="text-muted-foreground text-xs">
            Failed to load versions
          </p>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-2 text-xs font-medium tracking-wide uppercase">
        Minecraft Version
      </SidebarGroupLabel>
      <SidebarGroupContent className="px-2">
        <MultiSelectCombobox
          options={options}
          value={[...selected]}
          onValueChange={onToggle}
          placeholder={isLoading ? "Loading versions..." : "Select versions..."}
          label="Minecraft Version"
          disabled={isLoading}
          className="w-full min-w-0"
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// ---------------------------------------------------------------------------
// CheckboxFilterGroup
// ---------------------------------------------------------------------------

function CheckboxFilterGroup({
  filter,
  selected,
  onToggle,
}: {
  filter: FilterOption;
  selected: readonly string[];
  onToggle: (option: string, checked: boolean) => void;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-2 text-xs font-medium tracking-wide uppercase">
        {filter.label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="space-y-1 px-2 pt-1">
          {filter.options.map((option) => {
            const id = `${filter.key}-${option}`
              .toLowerCase()
              .replaceAll(/[^a-z0-9]+/gu, "-");
            const isChecked = selected.includes(option);

            return (
              <label
                key={option}
                htmlFor={id}
                className="hover:bg-muted/60 flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
              >
                <Checkbox
                  id={id}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    onToggle(option, Boolean(checked))
                  }
                />
                <span className="text-xs leading-none font-medium">
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// ---------------------------------------------------------------------------
// FilterSidebar (main export)
// ---------------------------------------------------------------------------

export function FilterSidebar() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const search = useSearch({ strict: false }) as ResourceSearch;
  const navigate = useNavigate();

  const activeSection = getActiveSection(pathname);
  const activeFilters = activeSection ? filters[activeSection] : [];

  // Drop search params that no longer belong to the active section
  useEffect(() => {
    if (!activeSection) {
      return;
    }
    const sanitized = sanitizeSearch(search, filters[activeSection]);
    if (!searchEquals(search, sanitized)) {
      navigate({ replace: true, search: sanitized, to: "." });
    }
  }, [activeSection, navigate, search]);

  const activeFilterCount =
    normalizeList(search.tags).length +
    activeFilters.reduce(
      (sum, filter) => sum + normalizeList(search[filter.key]).length,
      0
    );

  const clearAllFilters = () => {
    navigate({
      replace: true,
      search: (prev: ResourceSearch) => {
        const next: ResourceSearch = {};
        if (prev.q) {
          next.q = prev.q;
        }
        return next;
      },
      to: ".",
    });
  };

  const handleCheckboxChange = (
    filterKey: string,
    option: string,
    checked: boolean
  ) => {
    const current = normalizeList(search[filterKey]);
    const updated = checked
      ? [...current, option]
      : current.filter((v) => v !== option);

    navigate({
      replace: true,
      search: (prev: ResourceSearch) => {
        const next: ResourceSearch = { q: prev.q, tags: prev.tags };
        for (const filter of activeFilters) {
          if (filter.key === filterKey) {
            if (updated.length > 0) {
              next[filter.key] = updated;
            }
          } else {
            const values = normalizeList(prev[filter.key]);
            if (values.length > 0) {
              next[filter.key] = values;
            }
          }
        }
        return next;
      },
      to: ".",
    });
  };

  const handleVersionChange = (values: string[]) => {
    navigate({
      replace: true,
      search: (prev: ResourceSearch) => {
        const next: ResourceSearch = { q: prev.q, tags: prev.tags };
        for (const filter of activeFilters) {
          if (filter.key === "minecraft_version") {
            if (values.length > 0) {
              next["minecraft_version"] = values;
            }
          } else {
            const vals = normalizeList(prev[filter.key]);
            if (vals.length > 0) {
              next[filter.key] = vals;
            }
          }
        }
        return next;
      },
      to: ".",
    });
  };

  const isSkripts = activeSection === "skripts";

  return (
    <>
      {/* Header */}
      <SidebarGroup>
        <div className="flex items-center justify-between px-2 py-1">
          <SidebarGroupLabel className="text-muted-foreground p-0 text-xs font-medium tracking-wide uppercase">
            Filters
          </SidebarGroupLabel>
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge
                variant="secondary"
                className="h-5 px-1.5 text-[10px] font-semibold"
              >
                {activeFilterCount}
              </Badge>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground text-[11px] transition-colors"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </SidebarGroup>

      {/* Search */}
      <SearchInput />

      {/* Tags */}
      <TagsFilter />

      {/* Filter groups */}
      {activeFilters.map((filter) => {
        const isVersionFilter =
          filter.key === "minecraft_version" && !isSkripts;

        if (isVersionFilter) {
          return (
            <VersionFilter
              key={filter.key}
              selected={normalizeList(search[filter.key])}
              onToggle={handleVersionChange}
            />
          );
        }

        return (
          <CheckboxFilterGroup
            key={filter.key}
            filter={filter}
            selected={normalizeList(search[filter.key])}
            onToggle={(option, checked) =>
              handleCheckboxChange(filter.key, option, checked)
            }
          />
        );
      })}
    </>
  );
}
