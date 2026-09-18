import { Badge, Button } from "@codebybit/ui";
import { useNavigate, useRouterState, Link } from "@tanstack/react-router";
import { Download, ExternalLink, Plus, User } from "lucide-react";
import { useEffect, useState } from "react";

import { formatDownloads, formatPrice } from "@/lib/formatting";
import { listResources } from "@/server/functions/resources";
import { SECTION_LABELS } from "@/types/resource";
import type { Resource } from "@/types/resource";

import type { FilterSection } from "./filters";
import { getActiveSection } from "./filters";

// Strip section prefix from resource ID (e.g., "plugin-vaultx" -> "vaultx")
function stripSectionPrefix(id: string, section: string): string {
  const prefix = `${section}-`;
  return id.startsWith(prefix) ? id.slice(prefix.length) : id;
}

function ResourceCard({
  resource,
  section,
}: {
  resource: Resource;
  section: FilterSection;
}) {
  const attributeValues = Object.values(resource.attributes).flat().slice(0, 3);
  const tagValues = resource.tags.slice(0, 2);
  const cleanId = stripSectionPrefix(resource.id, section);

  return (
    <Link
      to="/resources/minecraft/$resourceId"
      params={{ resourceId: cleanId }}
      className="group/card border-border/50 bg-muted/20 hover:border-primary/30 hover:bg-muted/40 flex h-full flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="group-hover/card:text-foreground text-lg leading-snug font-semibold transition-colors">
            {resource.title}
          </h3>
          <Badge
            variant={resource.price === 0 ? "secondary" : "default"}
            className="shrink-0 text-xs"
          >
            {formatPrice(resource.price)}
          </Badge>
        </div>

        <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
          <User className="size-3.5" />
          {resource.authorId}
        </p>

        <div className="flex-1 space-y-3">
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
                className="text-xs font-normal"
              >
                {value}
              </Badge>
            ))}
            {tagValues.map((tag) => (
              <Badge key={tag} variant="ghost" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        <div className="border-border/40 mt-auto border-t pt-3">
          <div className="text-muted-foreground group-hover/card:text-primary flex w-full items-center justify-between text-sm font-medium transition-colors">
            <span>View Resource</span>
            <ExternalLink className="size-3.5" />
          </div>
        </div>
      </div>
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
        <p className="text-foreground text-sm font-medium">No resources yet</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Be the first to submit a resource in this category.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear filters
        </Button>
        <Button size="sm" render={<Link to="/resources/new" />}>
          <Plus className="size-4" />
          Submit Resource
        </Button>
      </div>
    </div>
  );
}

export function ResourceList() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const navigate = useNavigate();

  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const section = getActiveSection(pathname);

  useEffect(() => {
    if (!section) {
      return;
    }

    let cancelled = false;

    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const data = await listResources({ data: { section } });
        if (!cancelled) {
          setResources(data);
        }
      } catch {
        // Ignore errors
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchResources();
    return () => {
      cancelled = true;
    };
  }, [section]);

  if (!section) {
    return null;
  }

  const clearFilters = () => {
    navigate({ replace: true, search: {}, to: "." });
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {SECTION_LABELS[section as keyof typeof SECTION_LABELS]}
          </h1>
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? "Loading..."
              : (resources.length === 0
                ? "No resources"
                : `${resources.length} resource${resources.length === 1 ? "" : "s"}`)}
          </p>
        </div>
        <Button size="sm" render={<Link to="/resources/new" />}>
          <Plus className="size-4" />
          Submit
        </Button>
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border-border/50 bg-muted/20 h-48 animate-pulse rounded-2xl border"
            />
          ))}
        </div>
      ) : (resources.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <li key={resource.id}>
              <ResourceCard resource={resource} section={section} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState onClear={clearFilters} />
      ))}
    </div>
  );
}
