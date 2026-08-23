import { Badge, Button, Card, CardContent } from "@codebybit/ui";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Download,
  ExternalLink,
  Tag,
  User,
} from "lucide-react";

import { findResourceById } from "@/components/minecraft/resources";
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

export const Route = createFileRoute(
  "/resources/minecraft/resource/$resourceId",
)({
  head: ({ params }) => {
    const result = findResourceById(params.resourceId);
    const title = result?.resource.name ?? "Resource";
    const description =
      result?.resource.description ?? "View resource details on CodeByBit";
    return seo({
      title,
      description,
      path: `/resources/minecraft/resource/${params.resourceId}`,
    });
  },
  component: ResourceDetailPage,
});

function ResourceDetailPage() {
  const { resourceId } = Route.useParams();
  const result = findResourceById(resourceId);

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
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8">
      {/* Back link */}
      <Link
        to={sectionHref}
        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to {sectionLabel}
      </Link>

      {/* Header */}
      <header className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
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

      {/* Description + Attributes + Tags */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <p className="text-sm leading-relaxed">{resource.description}</p>

          {/* Attributes */}
          {attributeEntries.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Details
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {attributeEntries.map(([key, values]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-muted-foreground text-xs font-medium capitalize">
                      {key.replaceAll("_", " ")}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {values?.map((v) => (
                        <Badge key={v} variant="secondary" className="text-xs">
                          {v}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-muted-foreground flex items-center gap-1 text-xs font-medium tracking-wide uppercase">
                <Tag className="size-3" />
                Tags
              </h3>
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action */}
      <Button size="lg" className="w-full gap-2">
        View Resource
        <ExternalLink className="size-4" />
      </Button>
    </div>
  );
}
