"use client";

import { useHoverCapable } from "@codebybit/ui/hooks/use-hover-capable";
import { SPRING_MOUSE } from "@codebybit/ui/lib/ease";
import { cn } from "@codebybit/ui/lib/utils";
import { m, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";

export interface MagneticProps {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export function Magnetic({
  children,
  strength = 0.35,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  // Decorative cursor-follow: skip on touch (phantom hover) and reduced motion.
  const enabled = !reduce && canHover;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING_MOUSE);
  const sy = useSpring(y, SPRING_MOUSE);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !enabled) {
      return;
    }
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={cn("inline-block", className)}
    >
      {children}
    </m.div>
  );
}
