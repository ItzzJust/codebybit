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
    description,
    title,
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

  let imageUrl: string;
  if (image?.startsWith("http")) {
    imageUrl = image;
  } else if (image) {
    imageUrl = `${SITE_URL}${image}`;
  } else {
    imageUrl = buildOgImageUrl(fullTitle, description);
  }

  return {
    links: [
      { href: canonicalUrl, rel: "canonical" },
      { href: "/favicon.ico", rel: "icon" },
      { href: "/manifest.json", rel: "manifest" },
      { href: "/favicon.ico", rel: "apple-touch-icon" },
    ],
    meta: [
      { charSet: "utf-8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { title: fullTitle },
      { content: description, name: "description" },

      // Open Graph
      { content: type, property: "og:type" },
      { content: fullTitle, property: "og:title" },
      { content: description, property: "og:description" },
      { content: imageUrl, property: "og:image" },
      { content: canonicalUrl, property: "og:url" },
      { content: SITE_NAME, property: "og:site_name" },
      { content: "en_US", property: "og:locale" },

      // Twitter / X
      { content: "summary_large_image", name: "twitter:card" },
      { content: fullTitle, name: "twitter:title" },
      { content: description, name: "twitter:description" },
      { content: imageUrl, name: "twitter:image" },

      // Misc
      { content: "#000000", name: "theme-color" },
      { content: "index, follow", name: "robots" },
      { content: SITE_NAME, name: "author" },
      { content: SITE_NAME, name: "application-name" },
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
    links: [
      { href: "/favicon.ico", rel: "icon" },
      { href: "/manifest.json", rel: "manifest" },
      { href: "/favicon.ico", rel: "apple-touch-icon" },
    ],
    meta: [
      { charSet: "utf-8" },
      { content: "width=device-width, initial-scale=1", name: "viewport" },
      { title: SITE_NAME },
      { content: SITE_DESCRIPTION, name: "description" },

      // Open Graph defaults
      { content: "website", property: "og:type" },
      { content: SITE_NAME, property: "og:title" },
      { content: SITE_DESCRIPTION, property: "og:description" },
      { content: rootOgUrl, property: "og:image" },
      { content: SITE_URL, property: "og:url" },
      { content: SITE_NAME, property: "og:site_name" },
      { content: "en_US", property: "og:locale" },

      // Twitter / X defaults
      { content: "summary_large_image", name: "twitter:card" },
      { content: SITE_NAME, name: "twitter:title" },
      { content: SITE_DESCRIPTION, name: "twitter:description" },
      { content: rootOgUrl, name: "twitter:image" },

      // Misc
      { content: "#000000", name: "theme-color" },
      { content: "index, follow", name: "robots" },
      { content: SITE_NAME, name: "author" },
      { content: SITE_NAME, name: "application-name" },
    ],
  };
}
