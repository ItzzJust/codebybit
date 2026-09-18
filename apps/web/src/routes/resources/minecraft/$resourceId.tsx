import { Badge, Button, Card, CardContent } from "@codebybit/ui";
import { Markdown } from "@tanstack/markdown/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Download,
  ExternalLink,
  Eye,
  Package,
  Search,
  Tag,
  User,
} from "lucide-react";
import { m, useReducedMotion } from "motion/react";

import { formatDownloads, formatPrice } from "@/lib/formatting";
import { seo } from "@/lib/seo";
import { getResource } from "@/server/functions/resources";
import { SECTION_LABELS } from "@/types/resource";

export const Route = createFileRoute("/resources/minecraft/$resourceId")({
  head: ({ params }) =>
    seo({
      title: "Resource",
      description: "View resource details on CodeByBit",
      path: `/resources/minecraft/${params.resourceId}`,
    }),
  loader: async ({ params }) => {
    const resource = await getResource({ data: params.resourceId });
    return { resource };
  },
  component: ResourceDetailPage,
});

// ---------------------------------------------------------------------------
// LoadingSkeleton
// ---------------------------------------------------------------------------

function LoadingSkeleton() {
  const reduce = useReducedMotion();

  return (
    <m.div
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-0"
    >
      {/* Header skeleton (constrained) */}
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
        <div className="bg-muted h-5 w-28 animate-pulse rounded" />
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="bg-muted h-5 w-16 animate-pulse rounded-full" />
            <div className="bg-muted h-5 w-20 animate-pulse rounded-full" />
          </div>
          <div className="bg-muted h-9 w-3/4 animate-pulse rounded" />
          <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
        </div>
      </div>

      {/* Divider skeleton (full width) */}
      <div className="bg-muted/40 h-px" />

      {/* Content skeleton (constrained) */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <div className="bg-muted h-10 w-full animate-pulse rounded-xl lg:hidden" />
            <div className="bg-muted h-64 animate-pulse rounded-xl" />
          </div>
          <div className="space-y-4">
            <div className="bg-muted h-48 animate-pulse rounded-xl" />
            <div className="bg-muted h-24 animate-pulse rounded-xl" />
          </div>
        </div>
      </div>
    </m.div>
  );
}

// ---------------------------------------------------------------------------
// NotFound
// ---------------------------------------------------------------------------

function NotFound() {
  const reduce = useReducedMotion();

  return (
    <div className="space-y-0">
      {/* Header area with back link */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <m.div
          initial={reduce ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to="/resources/minecraft"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Minecraft
          </Link>
        </m.div>
      </div>

      {/* Full-width divider */}
      <div className="border-border/60 -mx-4 h-px sm:-mx-6 lg:-mx-8" />

      {/* Not found content */}
      <m.div
        initial={reduce ? false : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-4 py-12 text-center"
      >
        <div className="bg-muted/50 flex size-16 items-center justify-center rounded-full">
          <Package className="text-muted-foreground size-8" />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Resource not found</h1>
          <p className="text-muted-foreground max-w-sm text-sm">
            The resource you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
        </div>
        <Button variant="outline" render={<Link to="/resources/minecraft" />}>
          <Search className="size-4" />
          Browse Resources
        </Button>
      </m.div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ResourceDetailPage
// ---------------------------------------------------------------------------

function ResourceDetailPage() {
  const { resource } = Route.useLoaderData();
  const reduce = useReducedMotion();

  if (!resource) {
    return <NotFound />;
  }

  const sectionLabel = SECTION_LABELS[resource.section] ?? resource.section;
  const sectionHref = `/resources/minecraft/${resource.section}`;
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

  const isFree = resource.price === 0;

  return (
    <div className="space-y-0">
      {/* Back link + Header (constrained) */}
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
        {/* Back link */}
        <m.div
          initial={reduce ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            to={sectionHref}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to {sectionLabel}
          </Link>
        </m.div>

        {/* Header */}
        <m.header
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className="space-y-4"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {sectionLabel}
                </Badge>
                {resource.category && (
                  <Badge variant="secondary" className="text-xs">
                    {resource.category}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {resource.title}
              </h1>
            </div>
            <Badge
              variant={isFree ? "secondary" : "default"}
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
              Listed {createdDate}
            </span>
          </div>
        </m.header>
      </div>

      {/* Full-width divider — break out of parent max-w containers */}
      <div className="border-border/60 -mx-4 h-px sm:-mx-6 lg:-mx-8" />

      {/* Main content grid (constrained) */}
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
          {/* Left column - Main content */}
          <div className="space-y-6">
            {/* Action button (mobile only) */}
            <m.div
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Button size="lg" className="w-full gap-2 lg:hidden">
                {isFree ? (
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
            </m.div>

            {/* Description */}
            <m.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
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
            </m.div>

            {/* Attributes */}
            {attributeEntries.length > 0 && (
              <m.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
              >
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
              </m.div>
            )}

            {/* Tags */}
            {resource.tags.length > 0 && (
              <m.div
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
              >
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
              </m.div>
            )}
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-4">
            {/* Action card (desktop only) */}
            <m.div
              initial={reduce ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
            >
              <Card className="sticky top-20 hidden lg:block">
                <CardContent className="space-y-4 pt-6">
                  <Button size="lg" className="w-full gap-2">
                    {isFree ? (
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
                      Updated {updatedDate}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </m.div>

            {/* Author card */}
            <m.div
              initial={reduce ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
            >
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
            </m.div>

            {/* Section info */}
            <m.div
              initial={reduce ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-muted-foreground mb-3 text-xs font-medium tracking-wide uppercase">
                    Category
                  </h2>
                  <Button
                    variant="ghost-link"
                    className="w-full"
                    render={<Link to={sectionHref} />}
                  >
                    {sectionLabel}
                    <ArrowLeft className="ml-auto size-4 rotate-180" />
                  </Button>
                </CardContent>
              </Card>
            </m.div>
          </div>
        </div>
      </div>
    </div>
  );
}
