import { Badge, Button } from "@codebybit/ui";
import { useNavigate, useRouterState, Link } from "@tanstack/react-router";
import {
  Download,
  ExternalLink,
  ImageIcon,
  Plus,
  Sparkles,
  User,
} from "lucide-react";
import { m, useReducedMotion } from "motion/react";
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

// ---------------------------------------------------------------------------
// ResourceCard
// ---------------------------------------------------------------------------

function ResourceCard({
  resource,
  section,
  index,
}: {
  resource: Resource;
  section: FilterSection;
  index: number;
}) {
  const reduce = useReducedMotion();
  const attributeValues = Object.values(resource.attributes).flat().slice(0, 3);
  const tagValues = resource.tags.slice(0, 2);
  const cleanId = stripSectionPrefix(resource.id, section);
  const isFree = resource.price === 0;

  return (
    <m.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: reduce ? 0 : index * 0.05,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Link
        to="/resources/minecraft/$resourceId"
        params={{ resourceId: cleanId }}
        className="group/card border-border/40 bg-card hover:border-primary/20 hover:shadow-primary/5 hover:shadow-primary/5 flex h-full flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl"
      >
        {/* Image placeholder */}
        <div className="relative overflow-hidden">
          <div className="from-muted/60 via-muted/40 to-muted/20 flex aspect-[16/9] items-center justify-center bg-gradient-to-br">
            <ImageIcon className="text-muted-foreground/30 size-10 transition-transform duration-500 group-hover/card:scale-110" />
          </div>
          {/* Price badge */}
          <div className="absolute top-3 right-3">
            <Badge
              variant={isFree ? "secondary" : "default"}
              className="shadow-sm backdrop-blur-sm"
            >
              {formatPrice(resource.price)}
            </Badge>
          </div>
          {/* Free badge sparkle */}
          {isFree && (
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="gap-1 bg-emerald-500/10 text-emerald-600 shadow-sm backdrop-blur-sm dark:text-emerald-400"
              >
                <Sparkles className="size-3" />
                Free
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="space-y-1.5">
            <h3 className="group-hover/card:text-foreground text-base leading-snug font-semibold transition-colors">
              {resource.title}
            </h3>
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
              <User className="size-3.5" />
              {resource.authorId}
            </p>
          </div>

          <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
            {resource.description}
          </p>

          <div className="mt-auto space-y-3">
            {/* Stats */}
            <div className="text-muted-foreground flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1">
                <Download className="size-3.5" />
                {formatDownloads(resource.downloads)}
              </span>
            </div>

            {/* Tags */}
            {(attributeValues.length > 0 || tagValues.length > 0) && (
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
                  <Badge
                    key={tag}
                    variant="ghost"
                    className="text-xs font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-border/40 group-hover/card:border-primary/20 mt-auto border-t pt-3 transition-colors">
            <div className="text-muted-foreground group-hover/card:text-primary flex w-full items-center justify-between text-sm font-medium transition-colors">
              <span>View Resource</span>
              <ExternalLink className="size-3.5 transition-transform group-hover/card:translate-x-0.5" />
            </div>
          </div>
        </div>
      </Link>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="border-border/60 bg-muted/20 flex flex-col items-center gap-4 rounded-2xl border border-dashed p-12 text-center"
    >
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
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// LoadingSkeleton
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <m.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.06,
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="border-border/50 bg-muted/20 h-72 animate-pulse overflow-hidden rounded-2xl border"
        >
          <div className="bg-muted/40 aspect-[16/9] w-full" />
          <div className="space-y-3 p-5">
            <div className="bg-muted h-5 w-3/4 rounded" />
            <div className="bg-muted h-3 w-1/3 rounded" />
            <div className="bg-muted h-3 w-full rounded" />
            <div className="bg-muted h-3 w-2/3 rounded" />
          </div>
        </m.div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ResourceList
// ---------------------------------------------------------------------------

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
      <m.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between"
      >
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
      </m.header>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (resources.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, i) => (
            <li key={resource.id}>
              <ResourceCard resource={resource} section={section} index={i} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState onClear={clearFilters} />
      ))}
    </div>
  );
}
