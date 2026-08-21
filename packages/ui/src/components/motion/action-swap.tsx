"use client";

import {
  EASE_OUT,
  EASE_OUT_CSS,
  SPRING_PRESS,
  SPRING_SWAP,
} from "@codebybit/ui/lib/ease";
import { cn } from "@codebybit/ui/lib/utils";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import type { HTMLMotionProps, Variants } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export interface ActionSwapItem {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  ariaLabel?: string;
}

export type ActionSwapButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost";
export type ActionSwapButtonSize = "sm" | "md" | "lg" | "icon";
export type ActionSwapAnimation = "blur" | "roll" | "cascade";

/** Animations with a single-element variant set (cascade animates per letter). */
type CoreAnimation = "blur" | "roll";

export interface ActionSwapButtonProps extends Omit<
  HTMLMotionProps<"button">,
  "children" | "onChange"
> {
  items: ActionSwapItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, item: ActionSwapItem) => void;
  variant?: ActionSwapButtonVariant;
  size?: ActionSwapButtonSize;
  animation?: ActionSwapAnimation;
  iconOnly?: boolean;
  cycle?: boolean;
}

export interface ActionSwapTextProps {
  value: string;
  children: ReactNode;
  animation?: ActionSwapAnimation;
  className?: string;
}

export interface ActionSwapIconProps {
  value: string;
  children: ReactNode;
  animation?: ActionSwapAnimation;
  className?: string;
}

const BLUR_TRANSITION = { duration: 0.2, ease: "easeInOut" } as const;
const ROLL_TRANSITION = SPRING_SWAP;
const ROLL_EXIT_TRANSITION = { duration: 0.14, ease: EASE_OUT } as const;
const SWAP_BLUR = "blur(8px)";
const ROLL_BLUR = "blur(3px)";

// Cascade rolls the label one letter at a time, left to right. The leaving
// and landing strings overlap as independent layers (no shared cells), so
// proportional glyph widths never jitter. Exits cascade at half the enter
// stagger so the tail of the old label lingers briefly.
const CASCADE_STAGGER = 0.025;

const CASCADE_LETTER_VARIANTS: Variants = {
  animate: (delay: number = 0) => ({
    filter: "blur(0px)",
    opacity: 1,
    transition: { ...SPRING_SWAP, delay },
    y: "0%",
  }),
  exit: (delay: number = 0) => ({
    filter: ROLL_BLUR,
    opacity: 0,
    transition: { delay: delay * 0.5, duration: 0.16, ease: EASE_OUT },
    y: "-105%",
  }),
  initial: { filter: ROLL_BLUR, opacity: 0, y: "105%" },
};

const TEXT_VARIANTS: Record<CoreAnimation, Variants> = {
  blur: {
    animate: {
      filter: "blur(0px)",
      opacity: 1,
      scale: 1,
      transition: BLUR_TRANSITION,
    },
    exit: {
      filter: SWAP_BLUR,
      opacity: 0,
      scale: 0.94,
      transition: BLUR_TRANSITION,
    },
    initial: { filter: SWAP_BLUR, opacity: 0, scale: 0.94 },
  },
  roll: {
    animate: {
      filter: "blur(0px)",
      opacity: 1,
      transition: ROLL_TRANSITION,
      y: "0%",
    },
    exit: {
      filter: ROLL_BLUR,
      opacity: 0,
      transition: ROLL_EXIT_TRANSITION,
      y: "-90%",
    },
    initial: { filter: ROLL_BLUR, opacity: 0, y: "90%" },
  },
};

const ICON_VARIANTS: Record<CoreAnimation, Variants> = {
  blur: {
    animate: {
      filter: "blur(0px)",
      opacity: 1,
      scale: 1,
      transition: BLUR_TRANSITION,
    },
    exit: {
      filter: SWAP_BLUR,
      opacity: 0,
      scale: 0.25,
      transition: BLUR_TRANSITION,
    },
    initial: { filter: SWAP_BLUR, opacity: 0, scale: 0.25 },
  },
  roll: {
    animate: {
      filter: "blur(0px)",
      opacity: 1,
      transition: ROLL_TRANSITION,
      y: 0,
    },
    exit: {
      filter: ROLL_BLUR,
      opacity: 0,
      transition: ROLL_EXIT_TRANSITION,
      y: -12,
    },
    initial: { filter: ROLL_BLUR, opacity: 0, y: 12 },
  },
};

const VARIANT_CLASS: Record<ActionSwapButtonVariant, string> = {
  ghost: "text-muted-foreground hover:bg-primary/5 hover:text-foreground",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-primary/5",
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "border border-border bg-card text-foreground hover:border-border",
};

const SIZE_CLASS: Record<ActionSwapButtonSize, string> = {
  icon: "h-10 w-10 rounded-full",
  lg: "h-12 gap-2.5 rounded-full px-5 text-base",
  md: "h-10 gap-2 rounded-full px-4 text-sm",
  sm: "h-8 gap-1.5 rounded-full px-3 text-xs",
};

export function ActionSwapText({
  value,
  children,
  animation = "blur",
  className,
}: ActionSwapTextProps) {
  const reduce = useReducedMotion();
  const measureRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number>();

  useLayoutEffect(() => {
    const nextWidth = measureRef.current?.offsetWidth;
    if (!nextWidth) {
      return;
    }
    setWidth((currentWidth) =>
      currentWidth === nextWidth ? currentWidth : nextWidth
    );
  });

  // Cascade needs a plain string to split into letters; non-string content
  // and reduced motion fall back to the closest single-element animation.
  const label = typeof children === "string" ? children : null;
  const cascade = animation === "cascade" && label !== null && !reduce;
  const coreAnimation: CoreAnimation =
    animation === "cascade" ? "roll" : animation;

  return (
    <span
      className={cn(
        "relative inline-block overflow-hidden align-bottom whitespace-nowrap",
        className
      )}
      style={{
        transition: reduce ? undefined : `width 220ms ${EASE_OUT_CSS}`,
        width,
      }}
    >
      <span
        ref={measureRef}
        aria-hidden
        className="invisible inline-block whitespace-nowrap"
      >
        {children}
      </span>
      {cascade ? (
        <>
          {/* Letters are decorative fragments; readers get the whole label. */}
          <span className="sr-only">{label}</span>
          <AnimatePresence initial={false}>
            <m.span
              key={`cascade-${value}`}
              aria-hidden
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute top-0 left-0 inline-block whitespace-pre"
            >
              {[...label].map((char, i) => (
                <m.span
                  // biome-ignore lint/suspicious/noArrayIndexKey: position is the slot identity — the letter at a position is exactly what rolls.
                  key={i}
                  custom={i * CASCADE_STAGGER}
                  variants={CASCADE_LETTER_VARIANTS}
                  className="inline-block whitespace-pre will-change-[opacity,filter,transform]"
                >
                  {char}
                </m.span>
              ))}
            </m.span>
          </AnimatePresence>
        </>
      ) : (
        <AnimatePresence initial={false}>
          <m.span
            key={`${animation}-${value}`}
            variants={TEXT_VARIANTS[coreAnimation]}
            initial={reduce ? false : "initial"}
            animate={
              reduce
                ? { filter: "blur(0px)", opacity: 1, scale: 1, y: 0 }
                : "animate"
            }
            exit={reduce ? undefined : "exit"}
            className="absolute top-0 left-0 inline-block will-change-[opacity,filter,transform]"
          >
            {children}
          </m.span>
        </AnimatePresence>
      )}
    </span>
  );
}

export function ActionSwapIcon({
  value,
  children,
  animation = "blur",
  className,
}: ActionSwapIconProps) {
  const reduce = useReducedMotion();
  // Icons are single elements — cascade maps to its closest motion, roll.
  const coreAnimation: CoreAnimation =
    animation === "cascade" ? "roll" : animation;

  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <m.span
          key={`${animation}-${value}`}
          aria-hidden
          variants={ICON_VARIANTS[coreAnimation]}
          initial={reduce ? false : "initial"}
          animate={
            reduce
              ? { filter: "blur(0px)", opacity: 1, scale: 1, y: 0 }
              : "animate"
          }
          exit={reduce ? undefined : "exit"}
          className="col-start-1 row-start-1 inline-flex items-center justify-center will-change-[opacity,filter,transform]"
        >
          {children}
        </m.span>
      </AnimatePresence>
    </span>
  );
}

export function ActionSwapButton({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = "secondary",
  size = "md",
  animation = "blur",
  iconOnly = size === "icon",
  cycle = true,
  className,
  disabled,
  onClick,
  ...rest
}: ActionSwapButtonProps) {
  const reduce = useReducedMotion();
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? items[0]?.id
  );
  const currentValue = value ?? internalValue;
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === currentValue)
  );
  const activeItem = items[activeIndex] ?? items[0];
  const hasIcon = items.some((item) => item.icon);
  const nextItem =
    cycle && items.length > 0
      ? items[(activeIndex + 1) % items.length]
      : undefined;

  if (!activeItem) {
    return null;
  }

  const accessibleLabel =
    activeItem.ariaLabel ??
    (iconOnly && typeof activeItem.label === "string"
      ? activeItem.label
      : undefined);

  return (
    <m.button
      type="button"
      disabled={disabled}
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
      transition={SPRING_PRESS}
      className={cn(
        "inline-flex items-center justify-center overflow-hidden font-medium transition-colors",
        "disabled:pointer-events-none disabled:opacity-50",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className
      )}
      aria-label={accessibleLabel}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled || !cycle || !nextItem) {
          return;
        }
        if (value === undefined) {
          setInternalValue(nextItem.id);
        }
        onValueChange?.(nextItem.id, nextItem);
      }}
      {...rest}
    >
      {hasIcon ? (
        <ActionSwapIcon
          value={activeItem.id}
          animation={animation}
          className="h-4 w-4"
        >
          {activeItem.icon ?? null}
        </ActionSwapIcon>
      ) : null}
      {iconOnly ? null : (
        <ActionSwapText value={activeItem.id} animation={animation}>
          {activeItem.label}
        </ActionSwapText>
      )}
    </m.button>
  );
}
