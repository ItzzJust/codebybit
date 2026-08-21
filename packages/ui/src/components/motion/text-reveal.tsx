"use client";

import { EASE_OUT } from "@codebybit/ui/lib/ease";
import { cn } from "@codebybit/ui/lib/utils";
import { m, useInView, useReducedMotion } from "motion/react";
import type { Transition } from "motion/react";
import { useRef } from "react";
import type { ElementType, ReactNode } from "react";

type SplitMode = "word" | "char";

export interface TextRevealProps {
  text: string | string[];
  as?: ElementType;
  className?: string;
  split?: SplitMode;
  stagger?: number;
  delay?: number;
  blur?: number;
  yOffset?: string | number;
  spring?: { stiffness?: number; damping?: number; mass?: number };
  once?: boolean;
  whileInView?: boolean;
  children?: ReactNode;
}

const DEFAULT_SPRING = { damping: 26, mass: 1.2, stiffness: 140 };

export function TextReveal({
  text,
  as: Comp = "span",
  className,
  split = "word",
  stagger = 0.09,
  delay = 0,
  blur = 12,
  yOffset = "40%",
  spring,
  once = true,
  whileInView = false,
  children,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4, once });
  const reduce = useReducedMotion();
  const shouldAnimate = whileInView ? inView : true;

  const lines = Array.isArray(text) ? text : [text];
  const s = { ...DEFAULT_SPRING, ...spring };

  let unitIndex = 0;
  const lineCounts = new Map<string, number>();

  return (
    <Comp ref={ref} className={cn("block", className)}>
      {lines.map((line) => {
        const units = split === "word" ? line.split(" ") : [...line];
        const lineCount = lineCounts.get(line) ?? 0;
        lineCounts.set(line, lineCount + 1);
        const lineKey = `${line}-${lineCount}`;
        const unitCounts = new Map<string, number>();

        return (
          <span key={lineKey} className="block">
            {units.map((unit, i) => {
              const d = delay + unitIndex * stagger;
              unitIndex += 1;
              const unitCount = unitCounts.get(unit) ?? 0;
              unitCounts.set(unit, unitCount + 1);
              const unitKey = `${unit}-${unitCount}`;
              const initial = reduce
                ? { opacity: 0 }
                : { filter: `blur(${blur}px)`, opacity: 0, y: yOffset };
              const animate = shouldAnimate
                ? reduce
                  ? { opacity: 1 }
                  : { filter: "blur(0px)", opacity: 1, y: 0 }
                : initial;
              const transition: Transition = reduce
                ? {
                    opacity: { delay: d * 0.3, duration: 0.25, ease: EASE_OUT },
                  }
                : {
                    filter: { delay: d, duration: 0.9, ease: EASE_OUT },
                    opacity: { delay: d, duration: 0.7, ease: EASE_OUT },
                    y: { type: "spring" as const, ...s, delay: d },
                  };
              return (
                <m.span
                  key={unitKey}
                  initial={initial}
                  animate={animate}
                  transition={transition}
                  className="inline-block"
                >
                  {unit}
                  {split === "word" && i < units.length - 1 ? (
                    <span className="inline-block">&nbsp;</span>
                  ) : null}
                </m.span>
              );
            })}
          </span>
        );
      })}
      {children}
    </Comp>
  );
}
