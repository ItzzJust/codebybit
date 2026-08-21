import {
  allFilterKeys,
  filterSections,
  normalizeList,
  sanitizeSearch,
} from "@codebybit/ui";
import type {
  FilterKey,
  FilterOption,
  FilterSection,
  ResourceSearch,
} from "@codebybit/ui";

export type { FilterKey, FilterOption, FilterSection, ResourceSearch };
export { allFilterKeys, filterSections, normalizeList, sanitizeSearch };

// ---- App-specific filter definitions ----

const minecraftVersion = {
  key: "minecraft_version",
  label: "Minecraft Version",
  options: ["1.21.8", "1.21.7", "1.21.6"],
} as const;

const skriptVersion = {
  key: "minecraft_version",
  label: "Minecraft Version",
  options: ["26.2", "26.1.x", "1.21.x", "1.20.x", "1.8.x"],
} as const;

const modLoader = {
  key: "mod_loader",
  label: "Mod Loader",
  options: ["Fabric", "Forge", "NeoForge", "Quilt"],
} as const;

const typeFilter = (options: readonly string[]) =>
  ({ key: "type", label: "Type", options }) as const;

const categoryFilter = (options: readonly string[]) =>
  ({ key: "category", label: "Category", options }) as const;

const softwareFilter = (label: string, options: readonly string[]) =>
  ({ key: "software", label, options }) as const;

export const filters = {
  builds: [
    minecraftVersion,
    typeFilter(["Survival", "Skyblock", "Minigame", "Creative"]),
  ],
  configs: [
    minecraftVersion,
    typeFilter(["Server", "Client", "Plugin", "Mod"]),
  ],
  "graphics-textures": [
    minecraftVersion,
    typeFilter(["Texture Pack", "GUI", "Icons", "Models"]),
  ],
  models: [
    minecraftVersion,
    typeFilter(["Block", "Item", "Entity", "Decoration"]),
  ],
  mods: [
    minecraftVersion,
    modLoader,
    categoryFilter(["Adventure", "Technology", "Magic", "Optimization"]),
  ],
  other: [minecraftVersion],
  plugins: [
    minecraftVersion,
    softwareFilter("Supported Software", [
      "Paper",
      "Spigot",
      "Purpur",
      "Folia",
    ]),
    categoryFilter(["Economy", "Admin", "Chat", "Gameplay"]),
  ],
  "server-jars": [
    minecraftVersion,
    softwareFilter("Software", ["Paper", "Spigot", "Purpur", "Vanilla"]),
  ],
  setups: [
    minecraftVersion,
    typeFilter(["Survival", "Skyblock", "Network", "Creative"]),
  ],
  skripts: [
    skriptVersion,
    categoryFilter(["Gameplay", "Admin", "Economy", "Fun"]),
  ],
} as const satisfies Record<string, readonly FilterOption[]>;

export function getActiveSection(
  pathname: string
): (typeof filterSections)[number] | undefined {
  return (filterSections as readonly string[]).find((section) =>
    pathname.startsWith(`/resources/minecraft/${section}`)
  ) as (typeof filterSections)[number] | undefined;
}
