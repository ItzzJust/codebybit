"use client";
// beui.dev/components/blocks/not-found

import { Magnetic } from "@codebybit/ui/components/motion/magnetic";
import { cn } from "@codebybit/ui/lib/utils";

import { NOT_FOUND_DEFAULTS, NotFoundActions, NotFoundStage } from "./shared";
import type { NotFoundProps } from "./shared";

export function NotFoundMagnetic({
  className,
  code = NOT_FOUND_DEFAULTS.code,
  title = NOT_FOUND_DEFAULTS.title,
  description = NOT_FOUND_DEFAULTS.description,
  homeHref,
  homeLabel,
  browseHref,
  browseLabel,
}: NotFoundProps) {
  const chars = [...code];

  return (
    <NotFoundStage className={className}>
      <h1
        aria-label={code}
        className="text-foreground flex items-center justify-center [font-size:clamp(5rem,18vw,12rem)] leading-none font-bold tracking-tighter select-none"
      >
        {chars.map((ch, i) => (
          <Magnetic
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed positional glyphs
            key={i}
            strength={0.6}
            className={cn(i > 0 && "-ml-2")}
          >
            <span aria-hidden className="inline-block px-1 tabular-nums">
              {ch}
            </span>
          </Magnetic>
        ))}
      </h1>

      <div className="flex flex-col items-center gap-2">
        <p className="text-foreground text-lg font-semibold">{title}</p>
        <p className="text-muted-foreground max-w-sm text-sm">{description}</p>
      </div>

      <NotFoundActions
        homeHref={homeHref}
        homeLabel={homeLabel}
        browseHref={browseHref}
        browseLabel={browseLabel}
      />
    </NotFoundStage>
  );
}
