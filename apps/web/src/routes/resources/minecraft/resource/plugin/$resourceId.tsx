import { Badge, Button, Card, CardContent } from "@codebybit/ui";
import { Markdown } from "@tanstack/markdown/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  Tag,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { FilterSection } from "@/components/minecraft/filters";
import { formatDownloads, formatPrice } from "@/lib/formatting";
import { seo } from "@/lib/seo";

interface DbResource {
  id: string;
  title: string;
  description: string;
  price: number;
  section: string;
  category: string | null;
  authorId: string;
  downloads: number;
  tags: string[];
  attributes: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

const SECTION_LABELS = {
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
} as const;

export const Route = createFileRoute(
  "/resources/minecraft/resource/plugin/$resourceId"
)({
  head: () =>
    seo({
      title: "Resource",
      description: "View resource details on CodeByBit",
      path: "/resources/minecraft/resource/plugin",
    }),
  component: ResourceDetailPage,
});

function ResourceDetailPage() {
  const { resourceId } = Route.useParams();
  const [resource, setResource] = useState<DbResource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchResource = async () => {
      setIsLoading(true);
      setNotFound(false);
      try {
        // Try fetching with section prefix first, then without
        const sections = [
          "plugins",
          "builds",
          "configs",
          "graphics-textures",
          "models",
          "mods",
          "other",
          "server-jars",
          "setups",
          "skripts",
        ];

        for (const section of sections) {
          const response = await fetch(
            `/api/resources/${section}-${resourceId}`,
            { signal: controller.signal }
          );
          if (response.ok) {
            const data = await response.json();
            setResource(data);
            return;
          }
        }

        // Try without section prefix
        const response = await fetch(`/api/resources/${resourceId}`, {
          signal: controller.signal,
        });
        if (response.ok) {
          const data = await response.json();
          setResource(data);
        } else {
          setNotFound(true);
        }
      } catch {
        // Ignore abort errors
      } finally {
        setIsLoading(false);
      }
    };

    fetchResource();
    return () => controller.abort();
  }, [resourceId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
        <div className="bg-muted h-8 w-32 animate-pulse rounded" />
        <div className="space-y-4">
          <div className="bg-muted h-10 w-3/4 animate-pulse rounded" />
          <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
        </div>
      </div>
    );
  }

  if (notFound || !resource) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Resource not found</h1>
        <p className="text-muted-foreground text-sm">
          The resource you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link to="/resources/minecraft" />}
        >
          Browse Resources
        </Button>
      </div>
    );
  }

  const section = resource.section as FilterSection;
  const sectionLabel =
    SECTION_LABELS[section as keyof typeof SECTION_LABELS] ?? section;
  const sectionHref = `/resources/minecraft/${section}` as const;
  const attributeEntries = Object.entries(resource.attributes).filter(
    ([, values]) => values && values.length > 0
  );

  const createdDate = new Date(resource.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const updatedDate = new Date(resource.updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
      {/* Back link */}
      <Link
        to={sectionHref}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to {sectionLabel}
      </Link>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {resource.title}
          </h1>
          <Badge
            variant={resource.price === 0 ? "secondary" : "default"}
            className="self-start text-sm"
          >
            {formatPrice(resource.price)}
          </Badge>
        </div>

        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <span className="flex items-center gap-1.5">
            <User className="size-4" />
            {resource.authorId}
          </span>
          <span className="flex items-center gap-1.5">
            <Download className="size-4" />
            {formatDownloads(resource.downloads)} downloads
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            {sectionLabel}
          </span>
        </div>
      </header>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
        {/* Left column - Main content */}
        <div className="space-y-6">
          {/* Action button (mobile only) */}
          <Button size="lg" className="w-full gap-2 lg:hidden">
            {resource.price === 0 ? (
              <>
                <Download className="size-4" />
                Download
              </>
            ) : (
              <>
                <ExternalLink className="size-4" />
                View Resource
              </>
            )}
          </Button>

          {/* Description with Markdown rendering */}
          <Card>
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Description
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <Markdown>{resource.description}</Markdown>
              </div>
            </CardContent>
          </Card>

          {/* Attributes */}
          {attributeEntries.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-muted-foreground mb-4 text-xs font-medium tracking-wide uppercase">
                  Details
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {attributeEntries.map(([key, values]) => (
                    <div key={key} className="space-y-2">
                      <p className="text-muted-foreground text-xs font-medium capitalize">
                        {key.replaceAll("_", " ")}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {values.map((v) => (
                          <Badge
                            key={v}
                            variant="secondary"
                            className="text-xs"
                          >
                            {v}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {resource.tags.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-muted-foreground mb-3 flex items-center gap-1 text-xs font-medium tracking-wide uppercase">
                  <Tag className="size-3" />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {resource.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column - Sidebar */}
        <div className="space-y-4">
          {/* Action card (desktop only) */}
          <Card className="sticky top-20 hidden lg:block">
            <CardContent className="space-y-4 pt-6">
              <Button size="lg" className="w-full gap-2">
                {resource.price === 0 ? (
                  <>
                    <Download className="size-4" />
                    Download
                  </>
                ) : (
                  <>
                    <ExternalLink className="size-4" />
                    View Resource
                  </>
                )}
              </Button>

              <div className="text-muted-foreground space-y-2 text-center text-sm">
                <p className="flex items-center justify-center gap-1.5">
                  <Download className="size-4" />
                  {formatDownloads(resource.downloads)} downloads
                </p>
                <p className="flex items-center justify-center gap-1.5">
                  <Eye className="size-4" />
                  Last updated {updatedDate}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Author card */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
                Author
              </h2>
              <div className="flex items-center gap-3">
                <div className="bg-muted flex size-10 items-center justify-center rounded-full">
                  <User className="text-muted-foreground size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{resource.authorId}</p>
                  <p className="text-muted-foreground text-xs">
                    Listed {createdDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
