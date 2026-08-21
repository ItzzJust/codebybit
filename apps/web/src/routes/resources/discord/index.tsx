import { CategoryCard, PageHeader } from "@codebybit/ui";
import { createFileRoute } from "@tanstack/react-router";

import { discordCategories } from "@/data/discord/categories";

export const Route = createFileRoute("/resources/discord/")({
  component: DiscordResources,
});

function DiscordResources() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        badge="Discord"
        description="Bots, server setups, embeds, and moderation tools for your Discord community. Build a thriving server in minutes."
        title="Discord Resources"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {discordCategories.map((category) => (
          <CategoryCard
            key={category.id}
            description={category.description}
            href={category.href}
            icon={category.icon}
            id={category.id}
            title={category.title}
          />
        ))}
      </div>
    </main>
  );
}
