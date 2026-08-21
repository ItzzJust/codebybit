"use client";

import { StatefulButton } from "@codebybit/ui/components/motion/button";
import { Input } from "@codebybit/ui/components/motion/input";
import { EASE_OUT } from "@codebybit/ui/lib/ease";
import { cn } from "@codebybit/ui/lib/utils";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useId, useState } from "react";
import type { FormEvent, ReactNode } from "react";

export type SignInStatus = "idle" | "loading" | "success" | "error";

export interface SignInValues {
  email: string;
  password: string;
}

export type SignInErrors = Partial<Record<keyof SignInValues, string>>;

export interface SignInFormClassNames {
  root?: string;
  header?: string;
  title?: string;
  description?: string;
  fields?: string;
  password?: string;
  forgotPassword?: string;
  submit?: string;
  footer?: string;
}

export interface SignInFormProps {
  /** Controlled values. Omit for uncontrolled. */
  values?: SignInValues;
  defaultValues?: Partial<SignInValues>;
  onValuesChange?: (values: SignInValues) => void;

  /** Called with valid values only. Return a promise to drive the button state. */
  onSubmit?: (values: SignInValues) => void | Promise<void>;

  /** Replace the built-in validation rules. */
  validate?: (values: SignInValues) => SignInErrors;

  /** Controlled submit state. Omit to let the form track it. */
  status?: SignInStatus;

  /** Form-level failure message, shown above the submit button. */
  errorMessage?: string;

  title?: ReactNode;
  description?: ReactNode;
  submitLabel?: string;

  /** Optional forgot-password link. */
  forgotPasswordHref?: string;
  forgotPasswordLabel?: string;

  /** Content rendered below the submit button. */
  footer?: ReactNode;

  className?: string;
  classNames?: SignInFormClassNames;
}

const EMPTY_VALUES: SignInValues = {
  email: "",
  password: "",
};

// Deliberately permissive. The server remains the source of truth.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function defaultValidate(values: SignInValues): SignInErrors {
  const errors: SignInErrors = {};

  if (!values.email.trim()) {
    errors.email = "Enter your email.";
  } else if (!EMAIL_PATTERN.test(values.email)) {
    errors.email = "That doesn't look like an email address.";
  }

  if (!values.password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export function SignInForm({
  values: valuesProp,
  defaultValues,
  onValuesChange,
  onSubmit,
  validate,
  status: statusProp,
  errorMessage,
  title = "Welcome back",
  description = "Sign in to continue to your account.",
  submitLabel = "Sign in",
  forgotPasswordHref,
  forgotPasswordLabel = "Forgot password?",
  footer,
  className,
  classNames,
}: SignInFormProps) {
  const reduce = useReducedMotion();
  const baseId = useId();

  const controlled = valuesProp !== undefined;

  const [internalValues, setInternalValues] = useState<SignInValues>({
    ...EMPTY_VALUES,
    ...defaultValues,
  });

  const values = controlled ? valuesProp : internalValues;

  const [internalStatus, setInternalStatus] = useState<SignInStatus>("idle");

  const status = statusProp ?? internalStatus;

  const [revealPassword, setRevealPassword] = useState(false);

  const [touched, setTouched] = useState<
    Partial<Record<keyof SignInValues, boolean>>
  >({});

  const errors = (validate ?? defaultValidate)(values);

  const setValue = useCallback(
    <K extends keyof SignInValues>(key: K, next: SignInValues[K]) => {
      const nextValues = {
        ...values,
        [key]: next,
      };

      if (!controlled) {
        setInternalValues(nextValues);

        if (statusProp === undefined) {
          setInternalStatus((current) =>
            current === "success" || current === "error" ? "idle" : current
          );
        }
      }

      onValuesChange?.(nextValues);
    },
    [controlled, onValuesChange, statusProp, values]
  );

  const touch = useCallback((key: keyof SignInValues) => {
    setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }));
  }, []);

  const shownError = (key: keyof SignInValues) =>
    touched[key] ? errors[key] : undefined;

  const isValid = (key: keyof SignInValues) =>
    Boolean(touched[key]) && !errors[key] && Boolean(values[key]);

  const isSubmitting = status === "loading";
  const formErrorId = `${baseId}-form-error`;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    if (Object.keys(errors).length > 0) {
      return;
    }
    if (!onSubmit) {
      return;
    }

    if (statusProp === undefined) {
      setInternalStatus("loading");
    }

    try {
      await onSubmit(values);

      if (statusProp === undefined) {
        setInternalStatus("success");
      }
    } catch {
      if (statusProp === undefined) {
        setInternalStatus("error");
      }
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
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
        <Input
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          leftIcon={<Mail />}
          disabled={isSubmitting}
          value={values.email}
          onChange={(next) => setValue("email", next)}
          onBlur={() => touch("email")}
          error={shownError("email")}
          success={isValid("email")}
        />

        <div className={cn("flex flex-col gap-2", classNames?.password)}>
          <Input
            label="Password"
            type={revealPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            leftIcon={<Lock />}
            rightIcon={
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => setRevealPassword((prev) => !prev)}
                aria-label={revealPassword ? "Hide password" : "Show password"}
                aria-pressed={revealPassword}
                className="text-muted-foreground hover:text-foreground focus-visible:text-foreground transition-colors outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                {revealPassword ? <EyeOff /> : <Eye />}
              </button>
            }
            disabled={isSubmitting}
            value={values.password}
            onChange={(next) => setValue("password", next)}
            onBlur={() => touch("password")}
            error={shownError("password")}
            success={isValid("password")}
          />

          {forgotPasswordHref ? (
            <div className="flex justify-end px-1">
              <a
                href={forgotPasswordHref}
                className={cn(
                  "text-muted-foreground text-xs font-medium transition-colors",
                  "hover:text-foreground",
                  "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                  "rounded-sm",
                  classNames?.forgotPassword
                )}
              >
                {forgotPasswordLabel}
              </a>
            </div>
          ) : null}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {errorMessage ? (
          <motion.p
            id={formErrorId}
            role="alert"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{
              duration: 0.2,
              ease: EASE_OUT,
            }}
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
        loadingText="Signing in"
        successText="Signed in"
        errorText="Try again"
        aria-describedby={errorMessage ? formErrorId : undefined}
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
