import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/auth-layout";
import { SignUpForm } from "@/components/auth/sign-up-form";
import type { SignUpStatus } from "@/components/auth/sign-up-form";
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

function RegisterPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<SignUpStatus>("idle");

  const handleSubmit = useCallback(
    async (values: { name: string; email: string; password: string }) => {
      setStatus("loading");

      const { error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (error) {
        setStatus("error");
        toast.error(error.message || "Could not create account.");
        return;
      }

      setStatus("success");
      navigate({ to: "/" });
    },
    [navigate]
  );

  return (
    <AuthLayout>
      <SignUpForm
        status={status}
        onSubmit={handleSubmit}
        footer={
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-foreground font-medium transition-colors hover:underline"
            >
              Sign in
            </Link>
          </p>
        }
      />

      <p className="text-muted-foreground mt-4 text-center text-xs">
        By creating an account, you agree to our{" "}
        <span className="text-foreground font-medium">Terms of Service</span>
      </p>
    </AuthLayout>
  );
}
