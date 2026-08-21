import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  CloudDownload,
  Ellipsis,
  HardDrive,
  MapPin,
  PaintBucket,
  Plug,
  Puzzle,
  ScrollText,
  Settings,
} from "lucide-react";

export interface MinecraftCategory {
  description: string;
  href: string;
  icon: LucideIcon;
  id: string;
  title: string;
}

export const minecraftCategories: readonly MinecraftCategory[] = [
  {
    description: "Plugins for your Minecraft server.",
    href: "/resources/minecraft/plugins",
    icon: Plug,
    id: "plugins",
    title: "Plugins",
  },
  {
    description: "Complete server setups with pre-configured settings.",
    href: "/resources/minecraft/setups",
    icon: HardDrive,
    id: "setups",
    title: "Server Setups",
  },
  {
    description: "Server spawns, AFK areas, maps, and more.",
    href: "/resources/minecraft/builds",
    icon: MapPin,
    id: "builds",
    title: "Builds",
  },
  {
    description: "Configurations for popular Minecraft plugins.",
    href: "/resources/minecraft/configs",
    icon: Settings,
    id: "configs",
    title: "Configurations",
  },
  {
    description: "Graphics for your server and resource packs.",
    href: "/resources/minecraft/graphics-textures",
    icon: PaintBucket,
    id: "graphics-textures",
    title: "Graphics & Textures",
  },
  {
    description: "3D models and assets for your Minecraft server.",
    href: "/resources/minecraft/models",
    icon: Boxes,
    id: "models",
    title: "Models",
  },
  {
    description: "Server jars to power your Minecraft server.",
    href: "/resources/minecraft/server-jars",
    icon: CloudDownload,
    id: "server-jars",
    title: "Server Jars",
  },
  {
    description: "Skripts and automation for your Minecraft server.",
    href: "/resources/minecraft/skripts",
    icon: ScrollText,
    id: "skripts",
    title: "Skripts",
  },
  {
    description: "Mods and modifications for your Minecraft server.",
    href: "/resources/minecraft/mods",
    icon: Puzzle,
    id: "mods",
    title: "Mods",
  },
  {
    description: "Other types of Minecraft resources.",
    href: "/resources/minecraft/other",
    icon: Ellipsis,
    id: "other",
    title: "Other",
  },
];
