import { Logo } from "@codebybit/ui/components/custom/logo";
import { SignInForm } from "@codebybit/ui/components/motion/signin-form";
import type {
  SignInValues,
  SignInStatus,
} from "@codebybit/ui/components/motion/signin-form";
import { TextReveal } from "@codebybit/ui/components/motion/text-reveal";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Gamepad2, Layers, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/login")({
  head: () =>
    seo({
      title: "Login",
      description:
        "Sign in to your CodeByBit account to access Minecraft, Roblox, Discord, and web resources.",
      path: "/login",
    }),
  component: LoginPage,
});

const FEATURES = [
  {
    icon: <Gamepad2 className="size-5" />,
    title: "Minecraft Resources",
    description: "Discover mods, plugins, builds, and more.",
  },
  {
    icon: <Layers className="size-5" />,
    title: "Multi-Platform",
    description: "Roblox, Discord, and website resources.",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "Community Driven",
    description: "Built by creators, for creators.",
  },
] as const;

function LoginPage() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<SignInStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (values: SignInValues) => {
    setStatus("loading");
    setErrorMessage(undefined);

    const { error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message || "Invalid email or password.");
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
            text="Welcome back"
            as="h1"
            className="text-3xl font-bold tracking-tight xl:text-4xl"
            stagger={0.1}
            delay={0.2}
          />

          <div className="space-y-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
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
                  {feature.icon}
                </div>
                <div>
                  <p className="text-foreground text-sm font-medium">
                    {feature.title}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
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

          <SignInForm
            title="Sign in to CodeByBit"
            description="Enter your credentials to access your account"
            status={status}
            errorMessage={errorMessage}
            onSubmit={handleSubmit}
            footer={
              <p>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-foreground focus-visible:ring-ring rounded-sm font-medium transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  Register
                </Link>
              </p>
            }
          />
        </motion.div>
      </div>
    </main>
  );
}
