"use client";

import { StatefulButton } from "@codebybit/ui/components/motion/button";
import { EASE_OUT } from "@codebybit/ui/lib/ease";
import { cn } from "@codebybit/ui/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId } from "react";
import type { ReactNode } from "react";

export type AuthStatus = "idle" | "loading" | "success" | "error";

export interface AuthFormClassNames {
  root?: string;
  header?: string;
  title?: string;
  description?: string;
  fields?: string;
  submit?: string;
  footer?: string;
}

export interface AuthFormProps {
  /** Form-level failure message, shown above the submit button. */
  errorMessage?: string;

  title?: ReactNode;
  description?: ReactNode;
  submitLabel?: string;

  /** Text shown on the button during loading/success/error states. */
  loadingText?: string;
  successText?: string;
  errorText?: string;

  /** Controlled submit state. Omit to let the form track it. */
  status?: AuthStatus;

  /** Called when the form is submitted. */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;

  /** Content rendered inside the form fields area. */
  children: ReactNode;

  /** Content rendered below the submit button. */
  footer?: ReactNode;

  className?: string;
  classNames?: AuthFormClassNames;

  /** aria-describedby for the submit button (e.g. error message id). */
  "aria-describedby"?: string;
}

/**
 * Shared shell for sign-in and sign-up forms. Handles the form wrapper,
 * header, animated error message, submit button, and footer — leaving the
 * actual field layout to the consumer via `children`.
 */
export function AuthForm({
  errorMessage,
  title,
  description,
  submitLabel = "Continue",
  loadingText = "Working",
  successText = "Done",
  errorText = "Try again",
  status = "idle",
  onSubmit,
  children,
  footer,
  className,
  classNames,
  "aria-describedby": ariaDescribedBy,
}: AuthFormProps) {
  const reduce = useReducedMotion();
  const baseId = useId();
  const formErrorId = `${baseId}-form-error`;

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className={cn(
        "border-border flex w-full max-w-sm flex-col gap-5 rounded-3xl border p-6",
        className,
        classNames?.root
      )}
    >
      {title || description ? (
        <div className={cn("flex flex-col gap-1", classNames?.header)}>
          {title ? (
            <h2
              className={cn(
                "text-foreground text-xl font-semibold tracking-tight",
                classNames?.title
              )}
            >
              {title}
            </h2>
          ) : null}

          {description ? (
            <p
              className={cn(
                "text-muted-foreground text-sm",
                classNames?.description
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className={cn("flex flex-col gap-4", classNames?.fields)}>
        {children}
      </div>

      <AnimatePresence initial={false}>
        {errorMessage ? (
          <motion.p
            id={formErrorId}
            role="alert"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="border-destructive/30 bg-destructive/10 text-destructive rounded-2xl border px-3 py-2 text-xs"
          >
            {errorMessage}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <StatefulButton
        type="submit"
        size="lg"
        state={status}
        loadingText={loadingText}
        successText={successText}
        errorText={errorText}
        aria-describedby={errorMessage ? formErrorId : ariaDescribedBy}
        className={cn("w-full", classNames?.submit)}
      >
        {submitLabel}
      </StatefulButton>

      {footer ? (
        <div
          className={cn(
            "text-muted-foreground text-center text-sm",
            classNames?.footer
          )}
        >
          {footer}
        </div>
      ) : null}
    </form>
  );
}
