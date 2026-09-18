import { Download, ExternalLink } from "lucide-react";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type {
  FilterKey,
  FilterOption,
  ResourceSearch,
} from "./minecraft-filters";
import { normalizeList } from "./minecraft-filters";

export interface Resource {
  id: string;
  name: string;
  author: string;
  description: string;
  price: number;
  downloads: number;
  tags: readonly string[];
  attributes: Partial<Record<FilterKey, readonly string[]>>;
}

function formatPrice(price: number): string {
  return price === 0 ? "Free" : `$${price.toFixed(2)}`;
}

function formatDownloads(downloads: number): string {
  if (downloads >= 1_000_000) {
    return `${(downloads / 1_000_000).toFixed(1)}M`;
  }
  if (downloads >= 1_000) {
    return `${(downloads / 1_000).toFixed(1)}K`;
  }
  return String(downloads);
}

function ResourceCard({ resource }: { resource: Resource }) {
  const attributeValues = Object.values(resource.attributes).flat().slice(0, 4);
  const tagValues = resource.tags.slice(0, 3);

  return (
    <Card className="group/card border-border/50 bg-muted/30 hover:border-border/80 hover:bg-muted/50 flex h-full flex-col transition-all duration-200">
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="group-hover/card:text-foreground text-base leading-snug font-semibold transition-colors">
            {resource.name}
          </CardTitle>
          <Badge
            variant={resource.price === 0 ? "secondary" : "default"}
            className="shrink-0 text-xs"
          >
            {formatPrice(resource.price)}
          </Badge>
        </div>

        <p className="text-muted-foreground text-xs font-medium">
          by {resource.author}
        </p>

        <CardDescription className="line-clamp-2 text-sm">
          {resource.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
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
        <div className="flex w-full items-center justify-between">
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            <Download className="size-3" />
            {formatDownloads(resource.downloads)}
          </span>
          <span className="text-muted-foreground group-hover/card:text-foreground flex items-center gap-1 text-xs font-medium transition-colors">
            View
            <ExternalLink className="size-3" />
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}

export interface ResourceListProps {
  /** Current URL search params parsed into a ResourceSearch */
  search: ResourceSearch;
  /** All resources for the current section */
  resources: readonly Resource[];
  /** Filter definitions for the current section */
  sectionFilters: readonly FilterOption[];
  /** Human-readable section title */
  title: string;
  /** Called when user clicks "Clear all filters" */
  onClearFilters: () => void;
}

export function ResourceList({
  search,
  resources: allResources,
  sectionFilters,
  title,
  onClearFilters,
}: ResourceListProps) {
  const query = search.q?.trim().toLowerCase();
  const selectedTags = normalizeList(search.tags);
  const selected = new Map<FilterKey, string[]>();

  for (const filter of sectionFilters) {
    const values = normalizeList(search[filter.key]);
    if (values.length > 0) {
      selected.set(filter.key, values);
    }
  }

  let filteredResources = allResources;

  if (query || selectedTags.length > 0 || selected.size > 0) {
    filteredResources = allResources.filter((resource) => {
      if (query) {
        const haystack = [
          resource.name,
          resource.description,
          resource.author,
          ...resource.tags,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) {
          return false;
        }
      }

      for (const tag of selectedTags) {
        if (!resource.tags.includes(tag)) {
          return false;
        }
      }

      for (const [key, values] of selected) {
        const resourceValues = resource.attributes[key] ?? [];
        for (const value of values) {
          if (!resourceValues.includes(value)) {
            return false;
          }
        }
      }

      return true;
    });
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">
          Showing {filteredResources.length} of {allResources.length} resources
        </p>
      </header>

      {filteredResources.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <li key={resource.id}>
              <ResourceCard resource={resource} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-border/60 bg-muted/20 flex flex-col items-center gap-3 rounded-lg border border-dashed p-10 text-center">
          <p className="text-foreground text-sm font-medium">
            No resources match your filters
          </p>
          <p className="text-muted-foreground text-xs">
            Try removing some filters or tags.
          </p>
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
