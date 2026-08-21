import type { LucideIcon } from "lucide-react";
import { Boxes, Gamepad2, Globe, MessageSquare } from "lucide-react";

export interface ResourceCategory {
  badge: string;
  description: string;
  href: string;
  icon: LucideIcon;
  id: string;
  title: string;
}

export const resourceCategories: readonly ResourceCategory[] = [
  {
    badge: "10 subcategories",
    description:
      "Plugins, mods, builds, textures, server setups, and more for your Minecraft server.",
    href: "/resources/minecraft",
    icon: Boxes,
    id: "minecraft",
    title: "Minecraft",
  },
  {
    badge: "Coming soon",
    description:
      "Scripts, UI kits, 3D models, and game assets for Roblox developers.",
    href: "/resources/roblox",
    icon: Gamepad2,
    id: "roblox",
    title: "Roblox",
  },
  {
    badge: "Coming soon",
    description:
      "Templates, components, and full website themes for web projects.",
    href: "/resources/websites",
    icon: Globe,
    id: "websites",
    title: "Websites",
  },
  {
    badge: "Coming soon",
    description:
      "Bot setups, server templates, and community resources for Discord.",
    href: "/resources/discord",
    icon: MessageSquare,
    id: "discord",
    title: "Discord",
  },
];
