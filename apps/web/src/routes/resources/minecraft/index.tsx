import { CategoryCard, PageHeader } from "@codebybit/ui";
import { createFileRoute } from "@tanstack/react-router";

import { minecraftCategories } from "@/data/minecraft/categories";

export const Route = createFileRoute("/resources/minecraft/")({
  component: MinecraftResources,
});

function MinecraftResources() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        badge="Minecraft"
        description="Plugins, mods, builds, textures, server setups, and more. Find everything you need for your Minecraft server."
        title="Minecraft Resources"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {minecraftCategories.map((category) => (
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
