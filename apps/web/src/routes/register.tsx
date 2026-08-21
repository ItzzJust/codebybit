import { Logo } from "@codebybit/ui/components/custom/logo";
import { SignUpForm } from "@codebybit/ui/components/motion/signup-form";
import type {
  SignUpValues,
  SignUpStatus,
} from "@codebybit/ui/components/motion/signup-form";
import { TextReveal } from "@codebybit/ui/components/motion/text-reveal";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, Globe, Rocket, Users } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/register")({
  head: () =>
    seo({
      title: "Register",
      description:
        "Create a CodeByBit account to discover and share Minecraft, Roblox, Discord, and web resources.",
      path: "/register",
    }),
  component: RegisterPage,
});

const BENEFITS = [
  {
    icon: <Rocket className="size-5" />,
    title: "Instant Access",
    description: "Browse thousands of community-made resources.",
  },
  {
    icon: <Users className="size-5" />,
    title: "Join the Community",
    description: "Connect with creators and developers.",
  },
  {
    icon: <Globe className="size-5" />,
    title: "Cross-Platform",
    description: "Minecraft, Roblox, Discord, and more.",
  },
] as const;

function RegisterPage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<SignUpStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (values: SignUpValues) => {
    setStatus("loading");
    setErrorMessage(undefined);

    const { error } = await authClient.signUp.email({
      email: values.email,
      password: values.password,
      name: values.name,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message || "Could not create account.");
      return;
    }

    setStatus("success");
    navigate({ to: "/" });
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)]">
      {/* Left: Brand showcase — hidden on mobile */}
      <div className="bg-muted/30 relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-10">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-primary/8 absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full blur-3xl" />
          <div className="bg-primary/5 absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full blur-3xl" />
        </div>

        <div className="flex items-center gap-2">
          <Logo className="text-primary h-7 w-auto" />
          <span className="text-foreground text-lg font-bold tracking-tight">
            CodeByBit
          </span>
        </div>

        <div className="space-y-10">
          <TextReveal
            text="Start exploring"
            as="h1"
            className="text-3xl font-bold tracking-tight xl:text-4xl"
            stagger={0.1}
            delay={0.2}
          />

          <div className="space-y-4">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={reduce ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.6 + i * 0.12,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex items-start gap-3"
              >
                <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
                  {benefit.icon}
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    {benefit.title}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="border-border/60 flex items-center gap-3 rounded-xl border p-4"
          >
            <div className="bg-primary/10 flex size-8 items-center justify-center rounded-full">
              <Check className="text-primary size-4" />
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Free to join. No credit card required. Start downloading resources
              immediately.
            </p>
          </motion.div>
        </div>

        <p className="text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()} CodeByBit. All rights reserved.
        </p>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-8">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <Logo className="text-primary h-7 w-auto" />
            <span className="text-foreground text-lg font-bold tracking-tight">
              CodeByBit
            </span>
          </div>

          <SignUpForm
            title="Create your account"
            description="Join CodeByBit and start exploring resources"
            status={status}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
            footer={
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-foreground focus-visible:ring-ring rounded-sm font-medium transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Sign in
                </Link>
              </p>
            }
          />

          <p className="text-muted-foreground mt-4 text-center text-xs">
            By creating an account, you agree to our{" "}
            <span className="text-foreground font-medium">
              Terms of Service
            </span>
          </p>
        </motion.div>
      </div>
    </main>
  );
}
