import { CategoryCard, ResourceHeroLayout } from "@codebybit/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { m, useReducedMotion } from "motion/react";

import { resourceCategories } from "@/data/resource-categories";

export const Route = createFileRoute("/resources/")({
  component: ResourcesPage,
});

function ResourcesPage() {
  const reduce = useReducedMotion();

  return (
    <ResourceHeroLayout
      icon={Layers}
      title="All Resources"
      categoryCount={resourceCategories.length}
      description="Browse our collection of digital assets across all categories. Find everything you need for your Minecraft server, Roblox game, website, or Discord community."
      images={["/minecraft/0.png", "/roblox/0.jpg", "/discord/0.png"]}
    >
      {resourceCategories.map((category, i) => (
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
            badge={category.badge}
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
