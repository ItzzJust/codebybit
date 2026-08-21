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
      className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center overflow-hidden px-4 sm:px-6"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Main Headline Wrapper with forced text wrapping */}
        <div className="w-full max-w-full overflow-hidden text-center wrap-break-word">
          <ChromaticTextReveal
            prefix={prefix}
            words={[...words]}
            startOnView={false}
            className="text-foreground block w-full text-center text-2xl leading-tight font-extrabold tracking-tight text-balance wrap-break-word sm:text-5xl sm:leading-tight md:text-6xl lg:text-7xl"
          />
        </div>

        {/* Subtitle / Description */}
        {description && (
          <p className="text-muted-foreground mt-4 max-w-2xl text-sm leading-relaxed text-balance sm:mt-6 sm:text-lg md:text-xl">
            {description}
          </p>
        )}

        {/* Action Buttons */}
        {actions && actions.length > 0 && (
          <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:gap-4">
            {actions.map((action) => (
              <Button
                key={action.href}
                size="lg"
                variant={action.variant}
                className="w-full gap-2 font-semibold sm:w-auto"
                nativeButton={false}
                render={<a href={action.href}>{action.label}</a>}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
