// ---------------------------------------------------------------------------
// Shared resource types & constants
// Used by API routes, server functions, components, and hooks.
// ---------------------------------------------------------------------------

export interface Resource {
  attributes: Record<string, string[]>;
  authorId: string;
  category: string | null;
  createdAt: string;
  description: string;
  downloads: number;
  id: string;
  price: number;
  section: string;
  tags: string[];
  title: string;
  updatedAt: string;
}

// Section slug → human label (used in headers, badges, sidebar, detail page)
export const SECTION_LABELS: Record<string, string> = {
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

export type SectionSlug = keyof typeof SECTION_LABELS;

/** All valid section slugs as an array. */
export const SECTION_SLUGS = Object.keys(SECTION_LABELS) as SectionSlug[];
