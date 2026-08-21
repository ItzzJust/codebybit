import { CategoryCard, PageHeader } from "@codebybit/ui";
import { createFileRoute } from "@tanstack/react-router";

import { resourceCategories } from "@/data/resource-categories";

export const Route = createFileRoute("/resources/")({
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        badge="Marketplace"
        description="Browse our collection of digital assets across all categories. Find everything you need for your Minecraft server, Roblox game, website, or Discord community."
        title="All Resources"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {resourceCategories.map((category) => (
          <CategoryCard
            key={category.id}
            badge={category.badge}
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
