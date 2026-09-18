import { createFileRoute, Link } from "@tanstack/react-router";
import { m, useReducedMotion } from "motion/react";

import { seo } from "@/lib/seo";

export const Route = createFileRoute("/tos")({
  head: () =>
    seo({
      title: "Terms of Service",
      description:
        "Terms of Service for CodeByBit. Read about the rules and guidelines for using our platform.",
      path: "/tos",
    }),
  component: TermsOfServicePage,
});

const LAST_UPDATED = "September 1, 2026";

function TermsOfServicePage() {
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
          Terms of Service
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
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using CodeByBit (&quot;the Platform&quot;), you
            agree to be bound by these Terms of Service. If you do not agree to
            these terms, please do not use the Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2>2. Account Registration</h2>
          <p>
            To access certain features, you must create an account. You are
            responsible for maintaining the confidentiality of your account
            credentials and for all activities that occur under your account.
          </p>
          <p>
            You agree to provide accurate, current, and complete information
            during registration and to update such information as necessary.
          </p>
        </section>

        <section className="space-y-3">
          <h2>3. User Content</h2>
          <p>
            You retain ownership of any content you upload, post, or submit to
            the Platform (&quot;User Content&quot;). By submitting User Content,
            you grant CodeByBit a non-exclusive, worldwide, royalty-free license
            to host, display, and distribute your content solely for the purpose
            of operating and promoting the Platform.
          </p>
          <p>
            You represent and warrant that your User Content does not infringe
            on any third-party rights, including intellectual property rights,
            and that you have all necessary permissions to submit such content.
          </p>
        </section>

        <section className="space-y-3">
          <h2>4. Prohibited Content</h2>
          <p>You may not upload or share content that:</p>
          <ul>
            <li>Violates any applicable law or regulation</li>
            <li>Infringes on intellectual property rights of others</li>
            <li>Contains malware, viruses, or harmful code</li>
            <li>Is offensive, hateful, or discriminatory</li>
            <li>Promotes illegal activities</li>
            <li>Contains explicit or sexually explicit material</li>
            <li>Is designed to exploit or harm minors</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2>5. Free Resources</h2>
          <p>
            All resources on CodeByBit are currently offered free of charge.
            CodeByBit does not facilitate the sale of digital goods at this
            time. Pricing functionality may be introduced in the future, at
            which point these terms will be updated accordingly.
          </p>
        </section>

        <section className="space-y-3">
          <h2>6. Intellectual Property</h2>
          <p>
            The Platform, including its design, code, and branding, is owned by
            CodeByBit and protected by copyright and other intellectual property
            laws. You may not reproduce, distribute, or create derivative works
            without our prior written consent.
          </p>
        </section>

        <section className="space-y-3">
          <h2>7. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your account at our
            discretion, without notice, for conduct that we determine violates
            these terms or is harmful to other users, the Platform, or third
            parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2>8. Disclaimer of Warranties</h2>
          <p>
            The Platform is provided &quot;as is&quot; and &quot;as
            available&quot; without warranties of any kind, whether express or
            implied. We do not warrant that the Platform will be uninterrupted,
            error-free, or secure.
          </p>
        </section>

        <section className="space-y-3">
          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, CodeByBit shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages arising from your use of the Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2>10. Changes to These Terms</h2>
          <p>
            We may update these Terms of Service from time to time. We will
            notify you of any material changes by posting the new terms on this
            page and updating the &quot;Last updated&quot; date. Your continued
            use of the Platform after such changes constitutes acceptance of the
            updated terms.
          </p>
        </section>

        <section className="space-y-3">
          <h2>11. Contact</h2>
          <p>
            If you have questions about these Terms of Service, please contact
            us at{" "}
            <a href="mailto:support@codebybit.dev">support@codebybit.dev</a>.
          </p>
        </section>
      </m.div>

      <div className="border-border/60 h-px" />

      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          to="/privacy"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Privacy Policy
        </Link>
        <Link
          to="/refunds"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Refund Policy
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
