import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import { seo } from "@/lib/seo";

export const Route = createFileRoute("/credits")({
  head: () =>
    seo({
      title: "Credits",
      description:
        "Resources, artwork, and technologies used to build CodeByBit.",
      path: "/credits",
    }),
  component: CreditsPage,
});

interface Credit {
  category: string;
  description: string;
  href: string;
  source: string;
  title: string;
}

const CREDITS: Credit[] = [
  {
    category: "Images",
    description: "Background image used for the Minecraft category page.",
    href: "https://skinmc.net/wallpapers/56e35805-9a21-411b-8ab6-93c80aa5bba6/blackhole-saturn-buddies",
    source: "SkinMC",
    title: "Blackhole Saturn Buddies",
  },
  {
    category: "Images",
    description: "Wallpapers used across Roblox category pages.",
    href: "https://wallpapercat.com/roblox-wallpapers#download",
    source: "WallpaperCat",
    title: "Roblox Wallpapers",
  },
  {
    category: "TechStack",
    description:
      "Beautifully designed, accessible components built on Radix UI.",
    href: "https://ui.shadcn.com",
    source: "shadcn",
    title: "shadcn/ui",
  },
  {
    category: "TechStack",
    description: "Full-stack React framework with file-based routing and SSR.",
    href: "https://tanstack.com/start",
    source: "TanStack",
    title: "TanStack Start",
  },
  {
    category: "TechStack",
    description: "The library for building user interfaces.",
    href: "https://react.dev",
    source: "Meta",
    title: "React 19",
  },
  {
    category: "TechStack",
    description: "Utility-first CSS framework for rapid UI development.",
    href: "https://tailwindcss.com",
    source: "Tailwind Labs",
    title: "Tailwind CSS v4",
  },
  {
    category: "TechStack",
    description: "TypeScript ORM for SQL databases, designed for performance.",
    href: "https://orm.drizzle.team",
    source: "Drizzle Team",
    title: "Drizzle ORM",
  },
  {
    category: "TechStack",
    description: "Framework-agnostic authentication library for TypeScript.",
    href: "https://www.better-auth.com",
    source: "Better Auth",
    title: "Better Auth",
  },
  {
    category: "TechStack",
    description: "Production-ready animation library for React.",
    href: "https://motion.dev",
    source: "Matt Perry",
    title: "Motion for React",
  },
  {
    category: "TechStack",
    description: "Beautiful, consistent icon set used throughout the app.",
    href: "https://lucide.dev",
    source: "Lucide",
    title: "Lucide Icons",
  },
];

const CATEGORIES = ["All", "Images", "TechStack"] as const;

function CreditsPage() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered =
    active === "All" ? CREDITS : CREDITS.filter((c) => c.category === active);

  return (
    <div className="py-8 sm:py-12">
      <header className="mb-8 space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Acknowledgements
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Credits
        </h1>
        <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
          External resources, artwork, and the technologies that power
          CodeByBit. Thanks to the creators who make these available.
        </p>
      </header>

      {/* Filter pills */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActive(cat)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              active === cat
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((credit) => (
          <Link
            key={credit.href}
            to={credit.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-card hover:border-primary/20 hover:bg-accent/50 flex h-full flex-col rounded-xl border p-5 transition-colors"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="bg-muted text-muted-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                {credit.category}
              </span>
              <ArrowUpRight
                className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </div>

            <h3 className="mb-1 font-semibold tracking-tight group-hover:underline">
              {credit.title}
            </h3>

            <p className="text-muted-foreground mb-3 flex-1 text-sm leading-relaxed">
              {credit.description}
            </p>

            <span className="text-muted-foreground text-xs font-medium">
              {credit.source}
            </span>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground text-sm">
            No credits in this category.
          </p>
        </div>
      )}
    </div>
  );
}
