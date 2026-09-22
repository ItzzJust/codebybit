import { Hero, Marquee, ResourceCategories } from "@codebybit/ui";
import type { ResourceCategory } from "@codebybit/ui";
import { Link, createFileRoute } from "@tanstack/react-router";

import { resourceCategories } from "@/data/resource-categories";
import { useRandomImage } from "@/hooks/use-random-image";

export const Route = createFileRoute("/")({ component: App });

// Single source of truth: the shared category data module. The home page only
// needs the subset that <ResourceCategories> renders.
const categories: readonly ResourceCategory[] = resourceCategories.map(
  ({ description, href, id, title }) => ({ description, href, id, title })
);

function App() {
  const minecraftImg = useRandomImage("minecraft");
  const robloxImg = useRandomImage("roblox");
  const websitesImg = useRandomImage("websites");
  const discordImg = useRandomImage("discord");

  type CategoryId = "discord" | "minecraft" | "roblox" | "websites";

  const imageMap = {
    discord: discordImg.src,
    minecraft: minecraftImg.src,
    roblox: robloxImg.src,
    websites: websitesImg.src,
  } satisfies Record<CategoryId, string>;

  // SAFETY: the home page only calls getRandomImage with one of the four
  // category ids above; any other id falls back to the default path below.
  const getRandomImage = (categoryId: string): string =>
    imageMap[categoryId as CategoryId] ?? `/${categoryId}/0.png`;

  return (
    <div className="-mx-4 -mt-16 -mr-4 -ml-4 sm:-mx-6 lg:-mx-8">
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

      {/* Category ticker */}
      <Marquee
        gap="3rem"
        speed={35}
        className="border-border/40 bg-muted/30 border-y py-4"
      >
        {resourceCategories.map((category) => (
          <Link
            key={category.id}
            to={category.href}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium tracking-wide transition-colors"
          >
            <category.icon aria-hidden className="size-4" />
            {category.title}
          </Link>
        ))}
      </Marquee>

      {/* Resource Categories Section */}
      <section
        id="resources"
        className="relative w-full overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:py-24"
      >
        <ResourceCategories
          categories={categories}
          getRandomImage={getRandomImage}
        />
      </section>
    </div>
  );
}
