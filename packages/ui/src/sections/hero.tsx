import { Link } from "@tanstack/react-router";

import { ChromaticTextReveal } from "../components/motion/chromatic-text-reveal";
import { Button } from "../components/ui/button";

export interface HeroAction {
  label: string;
  href: string;
  variant?: "default" | "outline";
}

export interface HeroProps {
  prefix?: string;
  words: readonly string[];
  description?: string;
  actions?: readonly HeroAction[];
}

export function Hero({
  prefix = "Find the best assets for your",
  words,
  description,
  actions,
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden"
    >
      {/* Gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="from-background via-background/95 to-background absolute inset-0 bg-linear-to-b" />
        <div className="bg-primary/5 absolute top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
        <div className="bg-primary/3 absolute top-2/3 left-1/4 h-[400px] w-[400px] rounded-full blur-3xl" />
        <div className="bg-primary/3 absolute top-1/3 right-1/4 h-[400px] w-[400px] rounded-full blur-3xl" />
      </div>

      {/* Bottom gradient fade for smooth transition to next section */}
      <div className="from-background pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-linear-to-t to-transparent" />

      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        {/* Badge */}
        <div className="bg-primary/10 text-primary mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
          <span className="bg-primary size-1.5 rounded-full" />
          Digital Marketplace
        </div>

        {/* Main Headline */}
        <div className="w-full max-w-full overflow-hidden text-center">
          <ChromaticTextReveal
            prefix={prefix}
            words={[...words]}
            startOnView={false}
            className="text-foreground block w-full text-center text-3xl leading-tight font-bold tracking-tight text-balance sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl"
          />
        </div>

        {/* Description */}
        {description && (
          <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed text-balance sm:mt-8 sm:text-lg md:text-xl">
            {description}
          </p>
        )}

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:gap-4">
            {actions.map((action) => (
              <Button
                key={action.href}
                size="lg"
                variant={action.variant}
                className="w-full gap-2 px-8 font-semibold sm:w-auto"
                nativeButton={false}
                render={<Link to={action.href}>{action.label}</Link>}
              />
            ))}
          </div>
        )}

        {/* Trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm sm:mt-16">
          <div className="text-muted-foreground flex items-center gap-2">
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Free & Premium Assets</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Instant Downloads</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Community Verified</span>
          </div>
        </div>
      </div>
    </section>
  );
}
