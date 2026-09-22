import { Button } from "@codebybit/ui/components/ui/button";
import { Input } from "@codebybit/ui/components/ui/input";
import { Label } from "@codebybit/ui/components/ui/label";
import { Eye, EyeOff, Lock, Loader2, User } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { useCallback, useState } from "react";
import type { FormEvent, ReactNode } from "react";

export interface SignInValues {
  email: string;
  password: string;
}

export type SignInStatus = "idle" | "loading" | "success" | "error";

interface SignInFormProps {
  status?: SignInStatus;
  onSubmit?: (values: SignInValues) => void | Promise<void>;
  footer?: ReactNode;
}

export function SignInForm({
  status = "idle",
  onSubmit,
  footer,
}: SignInFormProps) {
  const reduce = useReducedMotion();
  const [values, setValues] = useState<SignInValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignInValues, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof SignInValues, boolean>>
  >({});
  const [showPassword, setShowPassword] = useState(false);

  const isSubmitting = status === "loading";

  const validate = useCallback((vals: SignInValues) => {
    const errs: Partial<Record<keyof SignInValues, string>> = {};
    if (!vals.email.trim()) {
      errs.email = "Enter your email or username.";
    }
    if (!vals.password) {
      errs.password = "Enter your password.";
    }
    return errs;
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }

    await onSubmit?.(values);
  };

  const updateField = (key: keyof SignInValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) {
      const next = { ...values, [key]: value };
      const errs = validate(next);
      setErrors((prev) => ({ ...prev, [key]: errs[key] }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Heading */}
      <m.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-1.5"
      >
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground text-sm">
          Sign in to access your account and resources.
        </p>
      </m.div>

      {/* Email / Username */}
      <m.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="flex flex-col gap-2"
      >
        <Label htmlFor="email">Email or Username</Label>
        <div className="relative">
          <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="email"
            type="text"
            autoComplete="username"
            placeholder="you@example.com or username"
            disabled={isSubmitting}
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            className="h-11 pl-9"
            aria-invalid={touched.email && !!errors.email}
          />
        </div>
        {touched.email && errors.email && (
          <p className="text-destructive text-xs">{errors.email}</p>
        )}
      </m.div>

      {/* Password */}
      <m.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button
            type="button"
            className="text-primary hover:text-primary/80 text-xs font-medium transition-colors"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={isSubmitting}
            value={values.password}
            onChange={(e) => updateField("password", e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
            className="h-11 pr-9 pl-9"
            aria-invalid={touched.password && !!errors.password}
          />
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {touched.password && errors.password && (
          <p className="text-destructive text-xs">{errors.password}</p>
        )}
      </m.div>

      {/* Submit */}
      <m.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </m.div>

      {footer && (
        <m.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="text-muted-foreground text-center text-sm"
        >
          {footer}
        </m.div>
      )}
    </form>
  );
}
