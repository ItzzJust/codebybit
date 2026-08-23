import { CategoryCard, ResourceHeroLayout } from "@codebybit/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Gamepad2 } from "lucide-react";
import { m, useReducedMotion } from "motion/react";

import { robloxCategories } from "@/data/roblox/categories";

export const Route = createFileRoute("/resources/roblox/")({
  component: RobloxResources,
});

function RobloxResources() {
  const reduce = useReducedMotion();

  return (
    <ResourceHeroLayout
      icon={Gamepad2}
      title="Roblox"
      categoryCount={robloxCategories.length}
      description="Scripts, models, UI kits, and game templates for Roblox developers. Everything you need to build your next game."
      images={["/roblox/0.jpg", "/roblox/1.jpg", "/roblox/2.jpg"]}
    >
      {robloxCategories.map((category, i) => (
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
