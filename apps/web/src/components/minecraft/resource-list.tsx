import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@codebybit/ui";
import { useNavigate, useRouterState, useSearch } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Download, ExternalLink } from "lucide-react";

import { formatDownloads, formatPrice } from "@/lib/formatting";

import type { FilterSection, ResourceSearch } from "./filters";
import { filters, getActiveSection } from "./filters";
import { filterResources, resourcesBySection } from "./resources";
import type { Resource } from "./resources";

const SECTION_TITLES: Record<FilterSection, string> = {
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
};

function ResourceCard({ resource }: { resource: Resource }) {
  const attributeValues = Object.values(resource.attributes).flat().slice(0, 3);
  const tagValues = resource.tags.slice(0, 2);

  return (
    <Card className="group/card border-border/50 bg-muted/30 hover:border-border/80 hover:bg-muted/50 flex h-full flex-col transition-colors duration-200 hover:shadow-md">
      <CardHeader className="gap-2">
        <CardTitle className="group-hover/card:text-foreground text-lg leading-snug font-semibold transition-colors">
          {resource.name}
        </CardTitle>

        <div className="flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs font-medium">
            by {resource.author}
          </p>
          <Badge
            variant={resource.price === 0 ? "secondary" : "default"}
            className="shrink-0 text-xs"
          >
            {formatPrice(resource.price)}
          </Badge>
        </div>

        <CardDescription className="line-clamp-3 text-sm">
          {resource.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
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
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1.5"
          nativeButton={false}
          render={
            <Link
              to="/resources/minecraft/resource/$resourceId"
              params={{ resourceId: resource.id }}
            />
          }
        >
          View Resource
          <ExternalLink className="size-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="border-border/60 bg-muted/20 flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
      <p className="text-foreground text-sm font-medium">
        No resources match your filters
      </p>
      <p className="text-muted-foreground text-xs">
        Try removing some filters or tags.
      </p>
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
  const allResources = resourcesBySection[section] ?? [];
  const resources = filterResources(allResources, search, sectionFilters);

  const clearFilters = () => {
    navigate({ replace: true, search: {}, to: "." });
  };

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">
          {SECTION_TITLES[section]}
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
