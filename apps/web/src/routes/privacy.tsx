import { createFileRoute, Link } from "@tanstack/react-router";
import { m, useReducedMotion } from "motion/react";

import { seo } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seo({
      title: "Privacy Policy",
      description:
        "Privacy Policy for CodeByBit. Learn how we collect, use, and protect your personal information.",
      path: "/privacy",
    }),
  component: PrivacyPolicyPage,
});

const LAST_UPDATED = "September 1, 2026";

function PrivacyPolicyPage() {
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
          Privacy Policy
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
          <h2>1. Introduction</h2>
          <p>
            CodeByBit (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you use our Platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2>2. Information We Collect</h2>
          <h3>Account Information</h3>
          <p>
            When you create an account, we collect your name, email address, and
            password (stored securely using industry-standard hashing).
          </p>
          <h3>Usage Data</h3>
          <p>
            We automatically collect information about your interactions with
            the Platform, including pages visited, features used, and time
            spent. This data is collected using cookies and similar
            technologies.
          </p>
          <h3>User Content</h3>
          <p>
            Any resources, descriptions, tags, or other content you upload to
            the Platform is stored on our servers and associated with your
            account.
          </p>
        </section>

        <section className="space-y-3">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve the Platform</li>
            <li>Create and manage your account</li>
            <li>Display your User Content to other users</li>
            <li>Send you account-related communications</li>
            <li>
              Monitor and analyze usage patterns to improve the experience
            </li>
            <li>Detect, prevent, and address technical issues</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2>4. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share your
            information only in the following circumstances:
          </p>
          <ul>
            <li>
              <strong>Public Content:</strong> Resources you upload are publicly
              visible to all Platform users. Your display name may be associated
              with your uploads.
            </li>
            <li>
              <strong>Service Providers:</strong> We may share data with
              third-party service providers who assist in operating the Platform
              (e.g., hosting, analytics).
            </li>
            <li>
              <strong>Legal Requirements:</strong> We may disclose your
              information if required by law or in response to valid legal
              requests.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2>5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your
            personal information. However, no method of electronic transmission
            or storage is 100% secure, and we cannot guarantee absolute
            security.
          </p>
        </section>

        <section className="space-y-3">
          <h2>6. Data Retention</h2>
          <p>
            We retain your account information for as long as your account is
            active. If you delete your account, we will remove your personal
            information within 30 days, though some anonymized data may be
            retained for analytics purposes.
          </p>
        </section>

        <section className="space-y-3">
          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
          </ul>
          <p>
            To exercise these rights, contact us at{" "}
            <a href="mailto:privacy@codebybit.dev">privacy@codebybit.dev</a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2>8. Cookies</h2>
          <p>
            We use essential cookies to operate the Platform. These include
            session cookies for authentication. We do not use third-party
            advertising cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2>9. Children&apos;s Privacy</h2>
          <p>
            The Platform is not intended for children under 13. We do not
            knowingly collect personal information from children under 13. If
            you believe we have collected such information, please contact us
            immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify
            you of any material changes by posting the new policy on this page
            and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section className="space-y-3">
          <h2>11. Contact</h2>
          <p>
            For questions about this Privacy Policy, contact us at{" "}
            <a href="mailto:privacy@codebybit.dev">privacy@codebybit.dev</a>.
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
