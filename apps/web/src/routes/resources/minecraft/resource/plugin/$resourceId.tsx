import { Markdown } from "@tanstack/markdown/react";
import { Badge, Button, Card, CardContent } from "@codebybit/ui";
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

import { resourcesBySection } from "@/components/minecraft/resources";
import type { Resource } from "@/components/minecraft/resources";
import type { FilterSection } from "@/components/minecraft/filters";
import { formatDownloads, formatPrice } from "@/lib/formatting";
import { seo } from "@/lib/seo";

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

// Find resource by clean ID (without section prefix)
function findResourceByCleanId(
  cleanId: string,
): { resource: Resource; section: FilterSection } | undefined {
  for (const [section, resources] of Object.entries(resourcesBySection)) {
    // Check both exact match and with section prefix
    const resource = resources.find(
      (r) => r.id === cleanId || r.id === `${section}-${cleanId}`,
    );
    if (resource) {
      return { resource, section: section as FilterSection };
    }
  }
  return undefined;
}

export const Route = createFileRoute(
  "/resources/minecraft/resource/plugin/$resourceId",
)({
  head: ({ params }) => {
    const result = findResourceByCleanId(params.resourceId);
    const title = result?.resource.name ?? "Resource";
    const description =
      result?.resource.description ?? "View resource details on CodeByBit";
    return seo({
      title,
      description,
      path: `/resources/minecraft/resource/plugin/${params.resourceId}`,
    });
  },
  component: ResourceDetailPage,
});

function ResourceDetailPage() {
  const { resourceId } = Route.useParams();
  const result = findResourceByCleanId(resourceId);

  if (!result) {
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

  const { resource, section } = result;
  // SAFETY: section is a valid key from the resource data structure
  const sectionLabel = SECTION_LABELS[section as keyof typeof SECTION_LABELS] ?? section;
  const sectionHref = `/resources/minecraft/${section}` as const;
  const attributeEntries = Object.entries(resource.attributes).filter(
    ([, values]) => values && values.length > 0,
  );

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
            {resource.name}
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
            {resource.author}
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
                        {values?.map((v) => (
                          <Badge key={v} variant="secondary" className="text-xs">
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
                  Last updated 2 days ago
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
                  <p className="text-sm font-medium">{resource.author}</p>
                  <p className="text-muted-foreground text-xs">
                    Member since 2023
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
