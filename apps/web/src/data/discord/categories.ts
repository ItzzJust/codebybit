import type { LucideIcon } from "lucide-react";
import {
  Bot,
  LayoutTemplate,
  MessageCircle,
  Server,
  Shield,
} from "lucide-react";

export interface DiscordCategory {
  description: string;
  href: string;
  icon: LucideIcon;
  id: string;
  title: string;
}

export const discordCategories: readonly DiscordCategory[] = [
  {
    description: "Ready-to-deploy Discord bots with slash commands and more.",
    href: "/resources/discord",
    icon: Bot,
    id: "bots",
    title: "Bots",
  },
  {
    description: "Server templates, channel structures, and role setups.",
    href: "/resources/discord",
    icon: Server,
    id: "server-setups",
    title: "Server Setups",
  },
  {
    description: "Embed builders, message templates, and announcement tools.",
    href: "/resources/discord",
    icon: MessageCircle,
    id: "embeds",
    title: "Embeds & Messages",
  },
  {
    description: "Verification, logging, and moderation system configs.",
    href: "/resources/discord",
    icon: Shield,
    id: "moderation",
    title: "Moderation",
  },
  {
    description: "Onboarding flows, welcome screens, and channel layouts.",
    href: "/resources/discord",
    icon: LayoutTemplate,
    id: "onboarding",
    title: "Onboarding",
  },
];
