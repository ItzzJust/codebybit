"use client";

import { useHoverCapable } from "@codebybit/ui/hooks/use-hover-capable";
import { SPRING_PRESS } from "@codebybit/ui/lib/ease";
import { cn } from "@codebybit/ui/lib/utils";
import { m, useReducedMotion } from "motion/react";

export interface NotFoundProps {
  className?: string;
  /** The big status code. */
  code?: string;
  title?: string;
  description?: string;
  homeHref?: string;
  homeLabel?: string;
  browseHref?: string;
  browseLabel?: string;
}

export const NOT_FOUND_DEFAULTS = {
  browseHref: "/components/motion",
  browseLabel: "Browse components",
  code: "404",
  description:
    "The page you are looking for moved, vanished, or never existed.",
  homeHref: "/",
  homeLabel: "Back home",
  title: "Page not found",
} as const;

type ActionsProps = Pick<
  NotFoundProps,
  "homeHref" | "homeLabel" | "browseHref" | "browseLabel" | "className"
>;

/** The shared dual CTA: a primary "Back home" and a secondary "Browse". */
export function NotFoundActions({
  homeHref = NOT_FOUND_DEFAULTS.homeHref,
  homeLabel = NOT_FOUND_DEFAULTS.homeLabel,
  browseHref = NOT_FOUND_DEFAULTS.browseHref,
  browseLabel = NOT_FOUND_DEFAULTS.browseLabel,
  className,
}: ActionsProps) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const whileTap = reduce ? undefined : { scale: 0.96 };
  const whileHover = reduce || !canHover ? undefined : { scale: 1.02 };

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-3",
        className
      )}
    >
      <m.a
        href={homeHref}
        whileTap={whileTap}
        whileHover={whileHover}
        transition={SPRING_PRESS}
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium transition-colors select-none"
      >
        {homeLabel}
      </m.a>
      <m.a
        href={browseHref}
        whileTap={whileTap}
        whileHover={whileHover}
        transition={SPRING_PRESS}
        className="border-border bg-card text-foreground hover:bg-primary/5 inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-medium transition-colors select-none"
      >
        {browseLabel}
      </m.a>
    </div>
  );
}

/** Centers a variant and gives it a consistent minimum stage height. */
export function NotFoundStage({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[420px] w-full flex-col items-center justify-center gap-8 px-4 text-center",
        className
      )}
    >
      {children}
    </div>
  );
}
