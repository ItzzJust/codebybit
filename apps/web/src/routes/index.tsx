import { Hero, ResourceCategories } from "@codebybit/ui";
import type { ResourceCategory } from "@codebybit/ui";
import { createFileRoute } from "@tanstack/react-router";

import { useRandomImage } from "@/hooks/use-random-image";

export const Route = createFileRoute("/")({ component: App });

const categories: readonly ResourceCategory[] = [
  {
    description:
      "Plugins, mods, builds, textures, server setups, and more for your Minecraft server.",
    href: "/resources/minecraft",
    id: "minecraft",
    images: [],
    title: "Minecraft",
  },
  {
    description:
      "Scripts, UI kits, 3D models, and game assets for Roblox developers.",
    href: "/resources/roblox",
    id: "roblox",
    images: [],
    title: "Roblox",
  },
  {
    description:
      "Templates, components, and full website themes for web projects.",
    href: "/resources/websites",
    id: "websites",
    images: [],
    title: "Websites",
  },
  {
    description:
      "Bot setups, server templates, and community resources for Discord.",
    href: "/resources/discord",
    id: "discord",
    images: [],
    title: "Discord",
  },
];

function App() {
  const minecraftImg = useRandomImage("minecraft");
  const robloxImg = useRandomImage("roblox");
  const websitesImg = useRandomImage("websites");
  const discordImg = useRandomImage("discord");

  const imageMap: Record<string, string> = {
    discord: discordImg.src,
    minecraft: minecraftImg.src,
    roblox: robloxImg.src,
    websites: websitesImg.src,
  };

  const getRandomImage = (categoryId: string): string =>
    imageMap[categoryId] ?? `/${categoryId}/0.png`;

  return (
    <div className="w-full overflow-x-hidden">
      <Hero
        prefix="Find the best assets for your"
        words={["Discord Server", "Minecraft Server", "Roblox Game", "Website"]}
        description="Elevate your community and games with modular, production-ready assets. Built for developers, creators, and server owners."
        actions={[
          {
            href: "/resources",
            label: "Explore Resources",
          },
          {
            href: "/resources/websites",
            label: "Browse Components",
            variant: "outline",
          },
        ]}
      />

      {/* Resource Categories Section */}
      <section
        id="resources"
        className="relative w-full overflow-hidden px-4 py-12 sm:px-6 sm:py-20 md:py-28 lg:py-32"
      >
        <ResourceCategories
          categories={categories}
          getRandomImage={getRandomImage}
        />
      </section>
    </div>
  );
}
