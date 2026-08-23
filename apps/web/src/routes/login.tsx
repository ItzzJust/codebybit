import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";

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
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = useCallback(
    async (values: { email: string; password: string }) => {
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
    },
    [navigate]
  );

  return (
    <AuthLayout>
      <SignInForm
        status={status}
        errorMessage={errorMessage}
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
