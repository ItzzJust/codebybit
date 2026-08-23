import { CategoryCard, ResourceHeroLayout } from "@codebybit/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Globe } from "lucide-react";
import { m, useReducedMotion } from "motion/react";

import { websiteCategories } from "@/data/websites/categories";

export const Route = createFileRoute("/resources/websites/")({
  component: WebsitesResources,
});

function WebsitesResources() {
  const reduce = useReducedMotion();

  return (
    <ResourceHeroLayout
      icon={Globe}
      title="Websites"
      categoryCount={websiteCategories.length}
      description="Templates, components, UI kits, and design assets for web projects. Ship beautiful sites faster."
      images={["/websites/0.png", "/websites/1.png", "/websites/0.png"]}
    >
      {websiteCategories.map((category, i) => (
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
