import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { AuthLayout } from "@/components/auth-layout";
import { SignInForm } from "@/components/auth/sign-in-form";
import type { SignInStatus } from "@/components/auth/sign-in-form";
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

function LoginPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<SignInStatus>("idle");

  const handleSubmit = useCallback(
    async (values: { email: string; password: string }) => {
      setStatus("loading");

      // Check if the input looks like an email
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(values.email);

      const result = isEmail
        ? await authClient.signIn.email({
            email: values.email,
            password: values.password,
          })
        : await authClient.signIn.username({
            username: values.email,
            password: values.password,
          });

      const { error } = result;

      if (error) {
        setStatus("error");
        toast.error(error.message || "Invalid credentials.");
        return;
      }

      setStatus("success");
      navigate({ to: "/" });
    },
    [navigate]
  );

  return (
    <AuthLayout>
      <SignInForm
        status={status}
        onSubmit={handleSubmit}
        footer={
          <p>
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-foreground font-medium transition-colors hover:underline"
            >
              Register
            </Link>
          </p>
        }
      />
    </AuthLayout>
  );
}
