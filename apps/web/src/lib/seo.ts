const SITE_NAME = "CodeByBit";
const SITE_DESCRIPTION =
  "The marketplace for Minecraft, Roblox, Discord, and web resources. Find plugins, mods, templates, bots, and more.";
const SITE_URL = "https://codebybit.dev";

/** Base path for the dynamic OG image endpoint */
const OG_API_PATH = "/api/og";

export interface SeoOptions {
  /** Page title — will be appended with " | CodeByBit" */
  title: string;
  /** Page-specific description (falls back to site description) */
  description?: string;
  /** Path segment appended to SITE_URL for canonical / og:url */
  path?: string;
  /** Override OG image path (relative to site root) */
  image?: string;
  /** Open Graph type */
  type?: "website" | "article";
}

/**
 * Build the dynamic OG image URL for a given title and description.
 * Uses the `/api/og` endpoint which renders the image on-the-fly via satori.
 */
function buildOgImageUrl(title: string, description: string): string {
  const params = new URLSearchParams({
    title,
    description,
  });
  return `${SITE_URL}${OG_API_PATH}?${params.toString()}`;
}

/**
 * Generates a consistent set of <meta> tags for TanStack Router's `head()`.
 *
 * Usage in a route:
 * ```ts
 * export const Route = createFileRoute("/foo")({
 *   head: () => seo({ title: "Foo", path: "/foo" }),
 *   component: Foo,
 * });
 * ```
 */
export function seo({
  title,
  description = SITE_DESCRIPTION,
  path = "",
  image,
  type = "website",
}: SeoOptions) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const imageUrl = image?.startsWith("http")
    ? image
    : image
      ? `${SITE_URL}${image}`
      : buildOgImageUrl(fullTitle, description);

  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: fullTitle },
      { name: "description", content: description },

      // Open Graph
      { property: "og:type", content: type },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:image", content: imageUrl },
      { property: "og:url", content: canonicalUrl },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_US" },

      // Twitter / X
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: imageUrl },

      // Misc
      { name: "theme-color", content: "#000000" },
      { name: "robots", content: "index, follow" },
      { name: "author", content: SITE_NAME },
      { name: "application-name", content: SITE_NAME },
    ],
    links: [
      { rel: "canonical", href: canonicalUrl },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/favicon.ico" },
    ],
  };
}

/**
 * Root-level head — applied to every page as a baseline.
 * Child routes merge/override these via their own `head()`.
 */
export function rootSeo() {
  const rootOgUrl = buildOgImageUrl(SITE_NAME, SITE_DESCRIPTION);

  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: SITE_NAME },
      { name: "description", content: SITE_DESCRIPTION },

      // Open Graph defaults
      { property: "og:type", content: "website" },
      { property: "og:title", content: SITE_NAME },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:image", content: rootOgUrl },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:locale", content: "en_US" },

      // Twitter / X defaults
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SITE_NAME },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: rootOgUrl },

      // Misc
      { name: "theme-color", content: "#000000" },
      { name: "robots", content: "index, follow" },
      { name: "author", content: SITE_NAME },
      { name: "application-name", content: SITE_NAME },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "apple-touch-icon", href: "/favicon.ico" },
    ],
  };
}
