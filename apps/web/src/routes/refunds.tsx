import { createFileRoute, Link } from "@tanstack/react-router";
import { m, useReducedMotion } from "motion/react";

import { seo } from "@/lib/seo";

export const Route = createFileRoute("/refunds")({
  head: () =>
    seo({
      title: "Refund Policy",
      description:
        "Refund Policy for CodeByBit. Learn about our refund and cancellation policies.",
      path: "/refunds",
    }),
  component: RefundPolicyPage,
});

const LAST_UPDATED = "September 1, 2026";

function RefundPolicyPage() {
  const reduce = useReducedMotion();

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
      <m.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Refund Policy
        </h1>
        <p className="text-muted-foreground text-sm">
          Last updated: {LAST_UPDATED}
        </p>
      </m.div>

      <m.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="prose prose-sm dark:prose-invert max-w-none space-y-6"
      >
        <section className="space-y-3">
          <h2>1. Free Resources</h2>
          <p>
            All resources on CodeByBit are currently available free of charge.
            As no payments are processed through the Platform, there are no
            refunds to process.
          </p>
        </section>

        <section className="space-y-3">
          <h2>2. Future Paid Features</h2>
          <p>
            If CodeByBit introduces paid features or premium content in the
            future, this Refund Policy will be updated to cover those
            transactions. We will notify all users before any paid features go
            live.
          </p>
        </section>

        <section className="space-y-3">
          <h2>3. Account Deletion</h2>
          <p>
            You may delete your account at any time. Account deletion is
            permanent and will remove your profile information. Uploaded
            resources may be retained in anonymized form or removed at our
            discretion.
          </p>
        </section>

        <section className="space-y-3">
          <h2>4. Content Removal</h2>
          <p>
            You may request removal of your uploaded resources at any time by
            contacting us. We will process removal requests within 7 business
            days.
          </p>
        </section>

        <section className="space-y-3">
          <h2>5. Contact</h2>
          <p>
            For any questions about this policy, contact us at{" "}
            <a href="mailto:support@codebybit.dev">support@codebybit.dev</a>.
          </p>
        </section>
      </m.div>

      <div className="border-border/60 h-px" />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          to="/tos"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Terms of Service
        </Link>
        <Link
          to="/privacy"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
