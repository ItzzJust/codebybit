import { CategoryCard, ResourceHeroLayout } from "@codebybit/ui";
import { createFileRoute } from "@tanstack/react-router";
import { Blocks } from "lucide-react";
import { m, useReducedMotion } from "motion/react";

import { minecraftCategories } from "@/data/minecraft/categories";

export const Route = createFileRoute("/resources/minecraft/")({
  component: MinecraftResources,
});

function MinecraftResources() {
  const reduce = useReducedMotion();

  return (
    <ResourceHeroLayout
      icon={Blocks}
      title="Minecraft"
      categoryCount={minecraftCategories.length}
      description="Plugins, mods, builds, textures, server setups, and more. Find everything you need for your Minecraft server."
      images={["/minecraft/0.png", "/minecraft/1.png", "/minecraft/2.png"]}
    >
      {minecraftCategories.map((category, i) => (
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
