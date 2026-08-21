import type { LucideIcon } from "lucide-react";
import { Layout, Palette, Puzzle, ShoppingCart, Type } from "lucide-react";

export interface WebsiteCategory {
  description: string;
  href: string;
  icon: LucideIcon;
  id: string;
  title: string;
}

export const websiteCategories: readonly WebsiteCategory[] = [
  {
    description: "Landing pages, SaaS templates, and multi-page themes.",
    href: "/resources/websites",
    icon: Layout,
    id: "templates",
    title: "Templates",
  },
  {
    description: "Reusable React, Vue, and vanilla JS components.",
    href: "/resources/websites",
    icon: Puzzle,
    id: "components",
    title: "Components",
  },
  {
    description: "Tailwind blocks, CSS kits, and design systems.",
    href: "/resources/websites",
    icon: Palette,
    id: "ui-kits",
    title: "UI Kits",
  },
  {
    description: "E-commerce themes and store templates.",
    href: "/resources/websites",
    icon: ShoppingCart,
    id: "ecommerce",
    title: "E-Commerce",
  },
  {
    description: "Typography packs, icon sets, and font bundles.",
    href: "/resources/websites",
    icon: Type,
    id: "assets",
    title: "Assets",
  },
];
