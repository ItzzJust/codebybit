import {
  Badge,
  Button,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@codebybit/ui";
import {
  useNavigate,
  useRouterState,
  useSearch,
  Link,
} from "@tanstack/react-router";
import { Download, ExternalLink, User } from "lucide-react";

import { formatDownloads, formatPrice } from "@/lib/formatting";

import type { FilterSection, ResourceSearch } from "./filters";
import { filters, getActiveSection } from "./filters";
import { filterResources, resourcesBySection } from "./resources";
import type { Resource } from "./resources";

const SECTION_TITLES = {
  builds: "Builds",
  configs: "Configurations",
  "graphics-textures": "Graphics & Textures",
  models: "Models",
  mods: "Mods",
  other: "Other",
  plugins: "Plugins",
  "server-jars": "Server Jars",
  setups: "Server Setups",
  skripts: "Skripts",
} as const satisfies Record<FilterSection, string>;

function ResourceCard({ resource }: { resource: Resource }) {
  const attributeValues = Object.values(resource.attributes)
    .flat()
    .slice(0, 3);
  const tagValues = resource.tags.slice(0, 2);

  return (
    <Link
      to="/resources/minecraft/resource/$resourceId"
      params={{ resourceId: resource.id }}
      className="group/card border-border/50 bg-muted/20 hover:border-primary/30 hover:bg-muted/40 flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg"
    >
      <CardHeader className="gap-2.5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="group-hover/card:text-foreground text-lg leading-snug font-semibold transition-colors">
            {resource.name}
          </CardTitle>
          <Badge
            variant={resource.price === 0 ? "secondary" : "default"}
            className="shrink-0 text-xs"
          >
            {formatPrice(resource.price)}
          </Badge>
        </div>

        <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
          <User className="size-3.5" />
          {resource.author}
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 pt-0">
        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
          {resource.description}
        </p>

        <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
          <Download className="size-3.5" />
          {formatDownloads(resource.downloads)} downloads
        </p>

        <div className="flex flex-wrap gap-1">
          {attributeValues.map((value) => (
            <Badge
              key={value}
              variant="outline"
              className="text-[11px] font-normal"
            >
              {value}
            </Badge>
          ))}
          {tagValues.map((tag) => (
            <Badge
              key={tag}
              variant="ghost"
              className="text-[11px] font-normal"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="border-border/40 border-t pt-3">
        <div className="text-muted-foreground group-hover/card:text-primary flex w-full items-center justify-between text-sm font-medium transition-colors">
          <span>View Resource</span>
          <ExternalLink className="size-3.5" />
        </div>
      </CardFooter>
    </Link>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="border-border/60 bg-muted/20 flex flex-col items-center gap-4 rounded-2xl border border-dashed p-12 text-center">
      <div className="bg-muted/50 flex size-12 items-center justify-center rounded-full">
        <svg
          className="text-muted-foreground size-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </div>
      <div>
        <p className="text-foreground text-sm font-medium">
          No resources match your filters
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Try removing some filters or tags.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  );
}

export function ResourceList() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const search = useSearch({ strict: false }) as ResourceSearch;
  const navigate = useNavigate();

  const section = getActiveSection(pathname);
  if (!section) {
    return null;
  }

  const sectionFilters = filters[section];
  // SAFETY: section is validated by getActiveSection to be a valid key of resourcesBySection
  const allResources = resourcesBySection[section as keyof typeof resourcesBySection] ?? [];
  const resources = filterResources(allResources, search, sectionFilters);

  const clearFilters = () => {
    navigate({ replace: true, search: {}, to: "." });
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {/* SAFETY: section is validated by getActiveSection to be a valid key of SECTION_TITLES */}
          {SECTION_TITLES[section as keyof typeof SECTION_TITLES]}
        </h1>
        <p className="text-muted-foreground text-sm">
          Showing {resources.length} of {allResources.length} resources
        </p>
      </header>

      {resources.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <li key={resource.id}>
              <ResourceCard resource={resource} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState onClear={clearFilters} />
      )}
    </div>
  );
}
