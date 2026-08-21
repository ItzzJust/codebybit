import { CategoryCard, PageHeader } from "@codebybit/ui";
import { createFileRoute } from "@tanstack/react-router";

import { websiteCategories } from "@/data/websites/categories";

export const Route = createFileRoute("/resources/websites/")({
  component: WebsitesResources,
});

function WebsitesResources() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <PageHeader
        badge="Websites"
        description="Templates, components, UI kits, and design assets for web projects. Ship beautiful sites faster."
        title="Website Resources"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {websiteCategories.map((category) => (
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
