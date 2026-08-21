import { CategoryCard, PageHeader } from "@codebybit/ui";
import { createFileRoute } from "@tanstack/react-router";

import { robloxCategories } from "@/data/roblox/categories";

export const Route = createFileRoute("/resources/roblox/")({
  component: RobloxResources,
});

function RobloxResources() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        badge="Roblox"
        description="Scripts, models, UI kits, and game templates for Roblox developers. Everything you need to build your next game."
        title="Roblox Resources"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {robloxCategories.map((category) => (
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
