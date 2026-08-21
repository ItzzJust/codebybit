"use client";

import { Badge } from "@codebybit/ui";
import { TextReveal } from "@codebybit/ui/components/motion/text-reveal";
import { cn } from "@codebybit/ui/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Blocks,
  Frame,
  Gamepad2,
  Globe,
  Image,
  Layers,
  Palette,
  Sparkles,
  Wand2,
} from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";

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

/* ── Data ────────────────────────────────────────────────────────────── */

interface Credit {
  title: string;
  description: string;
  href: string;
  source: string;
  category: string;
  icon: React.ReactNode;
}

const CREDITS: Credit[] = [
  {
    title: "Blackhole Saturn Buddies",
    description: "Background image used for the Minecraft category page.",
    href: "https://skinmc.net/wallpapers/56e35805-9a21-411b-8ab6-93c80aa5bba6/blackhole-saturn-buddies",
    source: "SkinMC",
    category: "Images",
    icon: <Image className="size-4" />,
  },
  {
    title: "Roblox Wallpapers",
    description: "Wallpapers used across Roblox category pages.",
    href: "https://wallpapercat.com/roblox-wallpapers#download",
    source: "WallpaperCat",
    category: "Images",
    icon: <Image className="size-4" />,
  },
  {
    title: "shadcn/ui",
    description:
      "Beautifully designed, accessible components built on Radix UI.",
    href: "https://ui.shadcn.com",
    source: "shadcn",
    category: "TechStack",
    icon: <Blocks className="size-4" />,
  },
  {
    title: "TanStack Start",
    description: "Full-stack React framework with file-based routing and SSR.",
    href: "https://tanstack.com/start",
    source: "TanStack",
    category: "TechStack",
    icon: <Layers className="size-4" />,
  },
  {
    title: "React 19",
    description: "The library for building user interfaces.",
    href: "https://react.dev",
    source: "Meta",
    category: "TechStack",
    icon: <Frame className="size-4" />,
  },
  {
    title: "Tailwind CSS v4",
    description: "Utility-first CSS framework for rapid UI development.",
    href: "https://tailwindcss.com",
    source: "Tailwind Labs",
    category: "TechStack",
    icon: <Palette className="size-4" />,
  },
  {
    title: "Drizzle ORM",
    description: "TypeScript ORM for SQL databases, designed for performance.",
    href: "https://orm.drizzle.team",
    source: "Drizzle Team",
    category: "TechStack",
    icon: <Wand2 className="size-4" />,
  },
  {
    title: "Better Auth",
    description: "Framework-agnostic authentication library for TypeScript.",
    href: "https://www.better-auth.com",
    source: "Better Auth",
    category: "TechStack",
    icon: <Sparkles className="size-4" />,
  },
  {
    title: "Motion for React",
    description: "Production-ready animation library for React.",
    href: "https://motion.dev",
    source: "Matt Perry",
    category: "TechStack",
    icon: <Gamepad2 className="size-4" />,
  },
  {
    title: "Lucide Icons",
    description: "Beautiful, consistent icon set used throughout the app.",
    href: "https://lucide.dev",
    source: "Lucide",
    category: "TechStack",
    icon: <Globe className="size-4" />,
  },
];

const CATEGORIES = ["All", "Images", "TechStack"] as const;

/* ── Animation variants ──────────────────────────────────────────────── */

const cardVariants = {
  hidden: { filter: "blur(6px)", opacity: 0, y: 16 },
  visible: (i: number) => ({
    filter: "blur(0px)",
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const pillVariants = {
  inactive: { scale: 1 },
  active: { scale: 1 },
};

/* ── Page ────────────────────────────────────────────────────────────── */

function CreditsPage() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("All");
  const reduce = useReducedMotion();

  const filtered = useMemo(
    () =>
      active === "All" ? CREDITS : CREDITS.filter((c) => c.category === active),
    [active]
  );

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b px-4 py-16 sm:py-24">
        {/* Gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-primary/5 absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full blur-3xl" />
          <div className="bg-primary/3 absolute top-0 right-0 h-[300px] w-[400px] rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <m.p
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-muted-foreground mb-4 text-sm font-medium tracking-wider uppercase"
          >
            Acknowledgements
          </m.p>

          <TextReveal
            text="Credits"
            as="h1"
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            stagger={0.12}
            delay={0.15}
          />

          <m.p
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-muted-foreground mx-auto mt-4 max-w-xl text-base leading-relaxed"
          >
            External resources, artwork, and the technologies that power
            CodeByBit. Thanks to the creators and communities who make these
            available.
          </m.p>
        </div>
      </section>

      {/* Filter pills */}
      <div className="mx-auto max-w-5xl px-4 pt-8 pb-2">
        <m.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter credits"
        >
          {CATEGORIES.map((cat) => (
            <m.button
              key={cat}
              variants={pillVariants}
              animate={active === cat ? "active" : "inactive"}
              whileHover={reduce ? undefined : { scale: 1.04 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              onClick={() => setActive(cat)}
              role="tab"
              aria-selected={active === cat}
              className={cn(
                "focus-visible:ring-ring rounded-full border px-4 py-1.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                active === cat
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {cat}
            </m.button>
          ))}
        </m.div>
      </div>

      {/* Cards grid */}
      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((credit, i) => (
            <m.div
              key={credit.href}
              custom={i}
              initial={reduce ? "visible" : "hidden"}
              animate="visible"
              variants={cardVariants}
            >
              <Link
                to={credit.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card hover:border-primary/20 hover:bg-accent/50 flex h-full flex-col rounded-xl border p-5 transition-colors"
              >
                <div className="mb-3 flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="gap-1.5 text-xs font-medium"
                  >
                    {credit.icon}
                    {credit.category}
                  </Badge>
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
            </m.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-sm">
              No credits in this category.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
