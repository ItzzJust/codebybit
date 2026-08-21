import type { LucideIcon } from "lucide-react";
import { Boxes, Gamepad2, Puzzle, Sparkles, WandSparkles } from "lucide-react";

export interface RobloxCategory {
  description: string;
  href: string;
  icon: LucideIcon;
  id: string;
  title: string;
}

export const robloxCategories: readonly RobloxCategory[] = [
  {
    description: "Lua scripts and game logic modules.",
    href: "/resources/roblox",
    icon: Puzzle,
    id: "scripts",
    title: "Scripts",
  },
  {
    description: "3D models, meshes, and assets for your game.",
    href: "/resources/roblox",
    icon: Boxes,
    id: "models",
    title: "Models",
  },
  {
    description: "UI kits, screen GUIs, and interface components.",
    href: "/resources/roblox",
    icon: Sparkles,
    id: "ui-kits",
    title: "UI Kits",
  },
  {
    description: "Complete game templates and starter kits.",
    href: "/resources/roblox",
    icon: Gamepad2,
    id: "templates",
    title: "Templates",
  },
  {
    description: "VFX, particles, and visual effects.",
    href: "/resources/roblox",
    icon: WandSparkles,
    id: "vfx",
    title: "VFX",
  },
];
