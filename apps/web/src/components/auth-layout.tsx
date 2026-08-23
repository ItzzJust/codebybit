import { Logo } from "@codebybit/ui/components/custom/logo";
import { m } from "motion/react";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="mb-8 flex items-center justify-center gap-2">
          <Logo className="text-primary h-7 w-auto" />
          <span className="text-foreground text-lg font-bold tracking-tight">
            CodeByBit
          </span>
        </div>

        {children}
      </m.div>
    </main>
  );
}
