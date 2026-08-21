import type {
  FilterKey,
  FilterOption,
  FilterSection,
  ResourceSearch,
} from "./filters";
import { normalizeList } from "./filters";

export interface Resource {
  id: string;
  name: string;
  author: string;
  description: string;
  /** Price in USD; 0 means free. */
  price: number;
  downloads: number;
  tags: readonly string[];
  /** Values keyed by the same filter keys the sidebar uses. */
  attributes: Partial<Record<FilterKey, readonly string[]>>;
}

const builds: readonly Resource[] = [
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Survival"],
    },
    author: "BlockForge",
    description:
      "Complete medieval village with a blacksmith, tavern, and detailed interiors.",
    downloads: 182_400,
    id: "build-medieval-village-starter",
    name: "Medieval Village Starter",
    price: 4.99,
    tags: ["builds", "survival", "featured"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.7"],
      type: ["Skyblock"],
    },
    author: "SkyForge",
    description:
      "Skyblock island set with cascading waterfalls and a central hub island.",
    downloads: 96_800,
    id: "build-floating-isles-skyblock",
    name: "Floating Isles Skyblock",
    price: 0,
    tags: ["skyblock", "survival", "popular"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Minigame"],
    },
    author: "PixelPlaza",
    description:
      "Modern minigame lobby with parkour course, NPC zones, and gamemode portals.",
    downloads: 310_200,
    id: "build-lobby-hub-deluxe",
    name: "Lobby Hub Deluxe",
    price: 9.99,
    tags: ["minigame", "lobby", "featured"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.6"],
      type: ["Creative"],
    },
    author: "CopperWorks",
    description:
      "Steampunk industrial district with factories, warehouses, and an airship dock.",
    downloads: 45_100,
    id: "build-industrial-district",
    name: "Industrial District",
    price: 6.5,
    tags: ["creative", "builds"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.7"],
      type: ["Survival"],
    },
    author: "MeadowMaps",
    description:
      "Cozy farmstead with greenhouse, orchard, and fully decorated animal pens.",
    downloads: 67_300,
    id: "build-cottagecore-farm",
    name: "Cottagecore Farm",
    price: 3.99,
    tags: ["survival", "builds", "popular"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Minigame"],
    },
    author: "ArenaCraft",
    description:
      "Multi-arena PvP complex with spectator areas, kit loadouts, and spawn lobby.",
    downloads: 128_900,
    id: "build-pvp-arena-complex",
    name: "PvP Arena Complex",
    price: 7.99,
    tags: ["pvp", "minigame"],
  },
];

const configs: readonly Resource[] = [
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Server"],
    },
    author: "OpsOptimized",
    description:
      "Curated server config pack tuned for 100+ concurrent players.",
    downloads: 254_000,
    id: "config-performance-server-pack",
    name: "Performance Server Pack",
    price: 0,
    tags: ["performance", "optimization", "updated"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.7"],
      type: ["Client"],
    },
    author: "ClientSide",
    description:
      "Client-side tweaks bundling shaders, UI polish, and quality-of-life fixes.",
    downloads: 89_700,
    id: "config-enhanced-vanilla-client",
    name: "Enhanced Vanilla Client",
    price: 0,
    tags: ["vanilla", "optimization"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Plugin"],
    },
    author: "ServerOps",
    description:
      "Battle-tested economy plugin configuration with balanced job rewards.",
    downloads: 41_200,
    id: "config-economy-plugin-setup",
    name: "Economy Plugin Setup",
    price: 2.99,
    tags: ["economy", "updated"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.6"],
      type: ["Mod"],
    },
    author: "TechCraft",
    description:
      "Balanced configuration for popular tech modpacks with curated recipes.",
    downloads: 33_600,
    id: "config-modpack-balance",
    name: "Modpack Balance Config",
    price: 0,
    tags: ["mods", "community"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.7"],
      type: ["Server"],
    },
    author: "IronServer",
    description:
      "Hardcore survival server rules, gamerules, and difficulty tuning.",
    downloads: 18_900,
    id: "config-hardcore-challenge",
    name: "Hardcore Challenge Pack",
    price: 0,
    tags: ["survival", "community"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Client"],
    },
    author: "ClientSide",
    description:
      "Clean minimal interface configuration for a distraction-free vanilla UI.",
    downloads: 22_400,
    id: "config-minimal-ui-overhaul",
    name: "Minimal UI Overhaul",
    price: 0,
    tags: ["vanilla", "lightweight"],
  },
];

const graphicsTextures: readonly Resource[] = [
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Texture Pack"],
    },
    author: "FaithfulTeam",
    description:
      "The classic faithful look remastered at 64x resolution for modern versions.",
    downloads: 1_240_000,
    id: "tex-faithful-x64-remaster",
    name: "Faithful x64 Remaster",
    price: 0,
    tags: ["texture-pack", "vanilla", "popular"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.7"],
      type: ["GUI"],
    },
    author: "GlowGUI",
    description:
      "Glowing neon interface elements, hotbar, and boss bar replacements.",
    downloads: 156_300,
    id: "tex-neon-hud-suite",
    name: "Neon HUD Suite",
    price: 2.49,
    tags: ["gui", "pvp"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Icons"],
    },
    author: "IconForge",
    description:
      "Over 300 hand-drawn server icons for shops, ranks, and GUI menus.",
    downloads: 78_500,
    id: "tex-custom-pack-icons",
    name: "Custom Pack Icons",
    price: 3.99,
    tags: ["icons", "servers"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.7"],
      type: ["Models"],
    },
    author: "ModelCraft",
    description: "3D item model overhaul with custom animations and lighting.",
    downloads: 210_800,
    id: "tex-fantasy-item-models",
    name: "Fantasy Item Models",
    price: 5.99,
    tags: ["models", "fantasy", "featured"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.6"],
      type: ["Texture Pack"],
    },
    author: "PastelWorks",
    description:
      "Gentle pastel recolors for every block with smooth transitions.",
    downloads: 64_200,
    id: "tex-soft-pastel-pack",
    name: "Soft Pastel Pack",
    price: 0,
    tags: ["texture-pack", "popular"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["GUI"],
    },
    author: "OldWorld",
    description:
      "Old-world UI styling with custom serif fonts and ornate borders.",
    downloads: 47_900,
    id: "tex-medieval-gui-fonts",
    name: "Medieval GUI & Fonts",
    price: 1.99,
    tags: ["gui", "medieval"],
  },
];

const models: readonly Resource[] = [
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Block"],
    },
    author: "BlockAnim",
    description:
      "Animated chest models with smooth opening mechanics and variations.",
    downloads: 98_600,
    id: "model-animated-chests",
    name: "Animated Chests",
    price: 0,
    tags: ["models", "animated"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.7"],
      type: ["Item"],
    },
    author: "ForgeCraft",
    description:
      "Detailed tool models with metallic shading and worn textures.",
    downloads: 54_300,
    id: "model-artisan-tools-set",
    name: "Artisan Tools Set",
    price: 2.99,
    tags: ["models", "fantasy"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Entity"],
    },
    author: "Bestiary",
    description:
      "Custom mob rigs for adventure maps, including dragons and golems.",
    downloads: 132_700,
    id: "model-mythic-creature-rigs",
    name: "Mythic Creature Rigs",
    price: 6.99,
    tags: ["models", "entities", "adventure"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.6"],
      type: ["Decoration"],
    },
    author: "StoneMason",
    description:
      "Gothic decoration pieces, furniture, and stained-glass windows.",
    downloads: 29_800,
    id: "model-cathedral-decor",
    name: "Cathedral Decor",
    price: 4.49,
    tags: ["models", "decoration", "medieval"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.7"],
      type: ["Block"],
    },
    author: "Geode",
    description:
      "Reimagined ore blocks with depth, glow, and crystal protrusions.",
    downloads: 76_100,
    id: "model-ore-vein-overhaul",
    name: "Ore Vein Overhaul",
    price: 0,
    tags: ["models", "vanilla"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Item"],
    },
    author: "Armory",
    description: "Fantasy weapon model pack featuring 40 hand-crafted pieces.",
    downloads: 88_400,
    id: "model-weapon-pack-vol2",
    name: "Weapon Pack Vol. 2",
    price: 3.49,
    tags: ["models", "pvp", "fantasy"],
  },
];

const mods: readonly Resource[] = [
  {
    attributes: {
      category: ["Technology"],
      minecraft_version: ["1.21.8"],
      mod_loader: ["Fabric", "Forge"],
    },
    author: "TerraWorks",
    description:
      "Worldgen overhaul with realistic biomes, caves, and mountain ranges.",
    downloads: 890_000,
    id: "mod-terracraft-enhanced",
    name: "TerraCraft: Enhanced",
    price: 0,
    tags: ["worldgen", "adventure", "popular"],
  },
  {
    attributes: {
      category: ["Magic"],
      minecraft_version: ["1.21.7"],
      mod_loader: ["Fabric", "Quilt"],
    },
    author: "MageGuild",
    description:
      "Expansive spellcasting system with over 120 unique spells and staves.",
    downloads: 412_500,
    id: "mod-arcane-awakening",
    name: "Arcane Awakening",
    price: 0,
    tags: ["magic", "fantasy", "featured"],
  },
  {
    attributes: {
      category: ["Adventure"],
      minecraft_version: ["1.21.6"],
      mod_loader: ["NeoForge"],
    },
    author: "AdventureForge",
    description:
      "Custom bosses, dungeons, and exploration content for adventure maps.",
    downloads: 178_900,
    id: "mod-dragons-roost-adventure",
    name: "Dragon's Roost Adventure",
    price: 4.99,
    tags: ["adventure", "bosses", "rpg"],
  },
  {
    attributes: {
      category: ["Optimization"],
      minecraft_version: ["1.21.8"],
      mod_loader: ["Fabric", "Quilt"],
    },
    author: "FrameRate",
    description: "Frame-rate boosting tweaks and render optimization add-ons.",
    downloads: 2_150_000,
    id: "mod-sodium-extras",
    name: "Sodium Extras",
    price: 0,
    tags: ["performance", "optimization", "open-source"],
  },
  {
    attributes: {
      category: ["Technology"],
      minecraft_version: ["1.21.7"],
      mod_loader: ["Forge", "NeoForge"],
    },
    author: "Kinetic",
    description:
      "Kinetic machinery expansion adding trains, automation, and steam power.",
    downloads: 634_700,
    id: "mod-create-steamworks",
    name: "Create: Steamworks",
    price: 0,
    tags: ["technology", "automation", "open-source"],
  },
  {
    attributes: {
      category: ["Magic"],
      minecraft_version: ["1.21.8"],
      mod_loader: ["Fabric"],
    },
    author: "Cultists",
    description:
      "Ritual-based magic system with custom altar mechanics and summoning.",
    downloads: 96_200,
    id: "mod-eldritch-rites",
    name: "Eldritch Rites",
    price: 2.99,
    tags: ["magic", "experimental"],
  },
];

const other: readonly Resource[] = [
  {
    attributes: {
      minecraft_version: ["1.21.8"],
    },
    author: "SoundCraft",
    description:
      "Custom soundtracks pressed onto in-game discs with unique art.",
    downloads: 112_400,
    id: "other-custom-music-discs",
    name: "Custom Music Discs",
    price: 1.99,
    tags: ["audio", "vanilla"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.7"],
    },
    author: "BrandDeck",
    description:
      "Complete server branding: logo, banners, social assets, and colors.",
    downloads: 45_800,
    id: "other-server-brand-kit",
    name: "Server Brand Kit",
    price: 3.99,
    tags: ["branding", "servers"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.6"],
    },
    author: "Cartographer",
    description: "Three prebuilt adventure maps with questlines and rewards.",
    downloads: 67_100,
    id: "other-map-pack-vol1",
    name: "Map Pack Vol. 1",
    price: 0,
    tags: ["adventure", "maps"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
    },
    author: "DatapackIO",
    description:
      "Utility datapack bundle with 40 ready-to-use vanilla datapacks.",
    downloads: 203_600,
    id: "other-datapack-starter-library",
    name: "Datapack Starter Library",
    price: 0,
    tags: ["datapack", "vanilla", "open-source"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.7"],
    },
    author: "PackLab",
    description:
      "Desktop tool for merging, organizing, and previewing resource packs.",
    downloads: 58_300,
    id: "other-resource-pack-merge-tool",
    name: "Resource Pack Merge Tool",
    price: 0,
    tags: ["tools", "open-source"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
    },
    author: "BrandDeck",
    description: "Banner templates designed for Minecraft content creators.",
    downloads: 34_900,
    id: "other-creator-banner-pack",
    name: "Creator Banner Pack",
    price: 0,
    tags: ["branding", "youtube"],
  },
];

const plugins: readonly Resource[] = [
  {
    attributes: {
      category: ["Economy"],
      minecraft_version: ["1.21.8"],
      software: ["Paper", "Spigot"],
    },
    author: "EconomyLabs",
    description:
      "Reliable economy API with multi-currency support and vault integration.",
    downloads: 1_870_000,
    id: "plugin-vaultx",
    name: "VaultX",
    price: 0,
    tags: ["economy", "api", "open-source", "updated"],
  },
  {
    attributes: {
      category: ["Admin"],
      minecraft_version: ["1.21.7"],
      software: ["Paper", "Spigot"],
    },
    author: "EssentialsTeam",
    description:
      "Server essentials: homes, warps, kits, and a full moderation toolkit.",
    downloads: 3_240_000,
    id: "plugin-essentialsx-pro",
    name: "EssentialsX Pro",
    price: 0,
    tags: ["essentials", "admin", "popular"],
  },
  {
    attributes: {
      category: ["Admin"],
      minecraft_version: ["1.21.8"],
      software: ["Paper", "Spigot"],
    },
    author: "GuardianSoft",
    description:
      "Block logging and rollback with lightning-fast query performance.",
    downloads: 756_300,
    id: "plugin-coreprotect-reborn",
    name: "CoreProtect Reborn",
    price: 0,
    tags: ["protection", "admin", "open-source"],
  },
  {
    attributes: {
      category: ["Chat"],
      minecraft_version: ["1.21.6"],
      software: ["Paper"],
    },
    author: "Chatline",
    description:
      "Custom chat formatting, nicknames, and per-group color schemes.",
    downloads: 189_400,
    id: "plugin-chatcolor-pro",
    name: "ChatColor Pro",
    price: 2.99,
    tags: ["chat", "customization"],
  },
  {
    attributes: {
      category: ["Gameplay"],
      minecraft_version: ["1.21.8"],
      software: ["Paper", "Folia"],
    },
    author: "ArenaSoft",
    description:
      "Custom minigame framework with arena builder and scoreboards.",
    downloads: 342_800,
    id: "plugin-minigames-arena",
    name: "MiniGames Arena",
    price: 5.99,
    tags: ["minigame", "framework"],
  },
  {
    attributes: {
      category: ["Economy"],
      minecraft_version: ["1.21.7"],
      software: ["Paper", "Spigot", "Purpur"],
    },
    author: "TradeWorks",
    description: "Chest shops with sign-based transactions and hopper support.",
    downloads: 521_600,
    id: "plugin-shopchest-deluxe",
    name: "ShopChest Deluxe",
    price: 0,
    tags: ["economy", "shops", "popular"],
  },
];

const serverJars: readonly Resource[] = [
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      software: ["Paper"],
    },
    author: "PaperMC",
    description:
      "Latest Paper build tuned for performance and community patches.",
    downloads: 5_600_000,
    id: "jar-paper-1218",
    name: "Paper 1.21.8 Build",
    price: 0,
    tags: ["paper", "performance", "updated"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      software: ["Purpur"],
    },
    author: "PurpurMC",
    description:
      "Fork with gameplay tweaks, configuration options, and API additions.",
    downloads: 2_100_000,
    id: "jar-purpur-hybrid",
    name: "Purpur Hybrid",
    price: 0,
    tags: ["purpur", "customization", "popular"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.7"],
      software: ["Spigot"],
    },
    author: "SpigotMC",
    description:
      "Stable Spigot release with build tools and documentation included.",
    downloads: 1_450_000,
    id: "jar-spigot-stable",
    name: "Spigot Stable Release",
    price: 0,
    tags: ["spigot", "vanilla", "stable"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.6"],
      software: ["Vanilla"],
    },
    author: "VanillaHQ",
    description:
      "Vanilla server jar with quality-of-life patches and no gameplay changes.",
    downloads: 640_200,
    id: "jar-vanilla-tweaks",
    name: "Vanilla Tweaks JAR",
    price: 0,
    tags: ["vanilla", "lightweight"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      software: ["Paper"],
    },
    author: "PaperMC",
    description:
      "Paper configured for regionized multithreading with Folia support.",
    downloads: 380_500,
    id: "jar-folia-paper",
    name: "Folia-Compatible Paper",
    price: 0,
    tags: ["folia", "performance", "experimental"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      software: ["Purpur"],
    },
    author: "OpsOptimized",
    description:
      "Purpur with Aikar's flags preconfigured for high-traffic servers.",
    downloads: 275_900,
    id: "jar-purpur-tuned",
    name: "Performance Tuned Purpur",
    price: 0,
    tags: ["purpur", "performance", "optimization"],
  },
];

const setups: readonly Resource[] = [
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Survival"],
    },
    author: "ServerOps",
    description:
      "Full Towny survival server setup with economy and land claims.",
    downloads: 234_700,
    id: "setup-towny-survival",
    name: "Towny Survival Setup",
    price: 0,
    tags: ["survival", "towny", "community"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.7"],
      type: ["Skyblock"],
    },
    author: "SkyForge",
    description:
      "Skyblock island progression setup with challenges and leaderboards.",
    downloads: 187_300,
    id: "setup-skyblock-paradise",
    name: "Skyblock Paradise",
    price: 3.99,
    tags: ["skyblock", "progression"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Network"],
    },
    author: "HubMaster",
    description:
      "Multi-server hub setup with bungee configs and player transfer menus.",
    downloads: 145_800,
    id: "setup-network-lobby",
    name: "Network Lobby Setup",
    price: 5.99,
    tags: ["network", "lobby", "featured"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.6"],
      type: ["Creative"],
    },
    author: "BuildCore",
    description:
      "Creative plot server setup with WorldEdit and plot permissions.",
    downloads: 98_400,
    id: "setup-creative-plot-world",
    name: "Creative Plot World",
    price: 0,
    tags: ["creative", "plots"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.8"],
      type: ["Survival"],
    },
    author: "IronServer",
    description:
      "Hardcore SMP server kit with custom events and seasonal resets.",
    downloads: 76_500,
    id: "setup-hardcore-smp-kit",
    name: "Hardcore SMP Kit",
    price: 2.49,
    tags: ["survival", "hardcore", "events"],
  },
  {
    attributes: {
      minecraft_version: ["1.21.7"],
      type: ["Network"],
    },
    author: "ArenaSoft",
    description:
      "Complete BedWars server setup with arenas, shop GUI, and stats.",
    downloads: 412_600,
    id: "setup-bedwars-server-pack",
    name: "BedWars Server Pack",
    price: 6.99,
    tags: ["minigame", "bedwars", "popular"],
  },
];

const skripts: readonly Resource[] = [
  {
    attributes: {
      category: ["Gameplay"],
      minecraft_version: ["26.2"],
    },
    author: "SkriptHub",
    description:
      "Custom join titles, sounds, and particle effects for every player.",
    downloads: 156_900,
    id: "skript-custom-join-effects",
    name: "Custom Join Effects",
    price: 0,
    tags: ["skript", "effects", "popular"],
  },
  {
    attributes: {
      category: ["Admin"],
      minecraft_version: ["26.1.x"],
    },
    author: "StaffLab",
    description: "Moderation commands, vanish, and staff-only GUI menus.",
    downloads: 89_200,
    id: "skript-staff-tools-suite",
    name: "Staff Tools Suite",
    price: 2.99,
    tags: ["skript", "admin", "moderation"],
  },
  {
    attributes: {
      category: ["Economy"],
      minecraft_version: ["1.21.x"],
    },
    author: "TradeWorks",
    description:
      "Sign-based shops built entirely in Skript with custom pricing.",
    downloads: 134_500,
    id: "skript-simple-shop-system",
    name: "Simple Shop System",
    price: 0,
    tags: ["skript", "economy", "shops"],
  },
  {
    attributes: {
      category: ["Gameplay"],
      minecraft_version: ["26.2"],
    },
    author: "LevelUp",
    description: "Leveling system with rank perks, titles, and XP events.",
    downloads: 112_800,
    id: "skript-player-ranks-levels",
    name: "Player Ranks & Levels",
    price: 1.99,
    tags: ["skript", "gameplay", "progression"],
  },
  {
    attributes: {
      category: ["Admin"],
      minecraft_version: ["1.20.x"],
    },
    author: "SkriptHub",
    description: "Scheduled announcements and automated community events.",
    downloads: 54_600,
    id: "skript-event-announcer",
    name: "Event Announcer",
    price: 0,
    tags: ["skript", "admin", "events"],
  },
  {
    attributes: {
      category: ["Fun"],
      minecraft_version: ["1.8.x"],
    },
    author: "PartyBox",
    description: "Drop party mechanics with random item showers for events.",
    downloads: 43_100,
    id: "skript-random-drop-parties",
    name: "Random Drop Parties",
    price: 0,
    tags: ["skript", "fun", "events"],
  },
];

export const resourcesBySection: Record<FilterSection, readonly Resource[]> = {
  builds,
  configs,
  "graphics-textures": graphicsTextures,
  models,
  mods,
  other,
  plugins,
  "server-jars": serverJars,
  setups,
  skripts,
};

/**
 * Look up a single resource by its unique ID across all sections.
 * Returns the resource and its section, or undefined if not found.
 */
export function findResourceById(
  id: string
): { resource: Resource; section: FilterSection } | undefined {
  for (const [section, resources] of Object.entries(resourcesBySection)) {
    const resource = resources.find((r) => r.id === id);
    if (resource) {
      return { resource, section: section as FilterSection };
    }
  }
  return undefined;
}

/**
 * Pure filter over resources given the current search params. `q` matches the
 * name, description, author, and tags; every selected tag must be present; and
 * every selected section-filter value must exist in the resource's attributes.
 */
export function filterResources(
  resources: readonly Resource[],
  search: ResourceSearch,
  sectionFilters: readonly FilterOption[]
): readonly Resource[] {
  const query = search.q?.trim().toLowerCase();
  const selectedTags = normalizeList(search.tags);
  const selected = new Map<FilterKey, string[]>();

  for (const filter of sectionFilters) {
    const values = normalizeList(search[filter.key]);
    if (values.length > 0) {
      selected.set(filter.key as FilterKey, values);
    }
  }

  if (!query && selectedTags.length === 0 && selected.size === 0) {
    return resources;
  }

  return resources.filter((resource) => {
    if (query) {
      const haystack = [
        resource.name,
        resource.description,
        resource.author,
        ...resource.tags,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }

    for (const tag of selectedTags) {
      if (!resource.tags.includes(tag)) {
        return false;
      }
    }

    for (const [key, values] of selected) {
      const resourceValues = resource.attributes[key] ?? [];
      for (const value of values) {
        if (!resourceValues.includes(value)) {
          return false;
        }
      }
    }

    return true;
  });
}
