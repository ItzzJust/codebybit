import { CategoryCard, ResourceHeroLayout } from "@codebybit/ui";
import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";
import { m, useReducedMotion } from "motion/react";

import { discordCategories } from "@/data/discord/categories";

export const Route = createFileRoute("/resources/discord/")({
  component: DiscordResources,
});

function DiscordResources() {
  const reduce = useReducedMotion();

  return (
    <ResourceHeroLayout
      icon={MessageSquare}
      title="Discord"
      categoryCount={discordCategories.length}
      description="Bots, server setups, embeds, and moderation tools for your Discord community. Build a thriving server in minutes."
      images={["/discord/0.png", "/discord/1.png", "/discord/0.png"]}
    >
      {discordCategories.map((category, i) => (
        <m.div
          key={category.id}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reduce ? 0 : i * 0.04,
            duration: 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <CategoryCard
            description={category.description}
            href={category.href}
            icon={category.icon}
            id={category.id}
            title={category.title}
          />
        </m.div>
      ))}
    </ResourceHeroLayout>
  );
}
