import { Button } from "@codebybit/ui/components/ui/button";
import { Checkbox } from "@codebybit/ui/components/ui/checkbox";
import { Input } from "@codebybit/ui/components/ui/input";
import { Label } from "@codebybit/ui/components/ui/label";
import { Eye, EyeOff, Lock, Loader2, Mail, User } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import React, { useCallback, useState } from "react";

export interface SignUpValues {
  confirmPassword: string;
  email: string;
  name: string;
  password: string;
  terms: boolean;
}

export type SignUpStatus = "idle" | "loading" | "success" | "error";

interface SignUpFormProps {
  status?: SignUpStatus;
  onSubmit?: (values: SignUpValues) => void | Promise<void>;
  footer?: React.ReactNode;
}

function validateSignUp(vals: SignUpValues) {
  const errs: Partial<Record<keyof SignUpValues, string>> = {};
  if (!vals.name.trim()) {
    errs.name = "Enter your name.";
  }
  if (!vals.email.trim()) {
    errs.email = "Enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(vals.email)) {
    errs.email = "Enter a valid email address.";
  }
  if (!vals.password) {
    errs.password = "Choose a password.";
  } else if (vals.password.length < 8) {
    errs.password = "Use at least 8 characters.";
  }
  if (!vals.confirmPassword) {
    errs.confirmPassword = "Confirm your password.";
  } else if (vals.confirmPassword !== vals.password) {
    errs.confirmPassword = "Passwords don't match.";
  }
  if (!vals.terms) {
    errs.terms = "Accept the terms to continue.";
  }
  return errs;
}

function FieldError({ error }: { error?: string }) {
  if (!error) {
    return null;
  }
  return <p className="text-destructive text-xs">{error}</p>;
}

export function SignUpForm({
  status = "idle",
  onSubmit,
  footer,
}: SignUpFormProps) {
  const reduce = useReducedMotion();
  const [values, setValues] = useState<SignUpValues>({
    confirmPassword: "",
    email: "",
    name: "",
    password: "",
    terms: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpValues, string>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof SignUpValues, boolean>>
  >({});
  const [showPassword, setShowPassword] = useState(false);

  const isSubmitting = status === "loading";

  const updateField = useCallback(
    <K extends keyof SignUpValues>(key: K, value: SignUpValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setTouched((prev) => ({ ...prev, [key]: true }));
    },
    []
  );

  // Derive errors from values via useEffect
  React.useEffect(() => {
    setErrors(validateSignUp(values));
  }, [values]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      confirmPassword: true,
      email: true,
      name: true,
      password: true,
      terms: true,
    });
    const errs = validateSignUp(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      return;
    }
    await onSubmit?.(values);
  };

  const fields = [
    { key: "name" as const, label: "Name", icon: User, inputProps: { id: "name", autoComplete: "name" as const, placeholder: "Your name" }, type: "text" },
    { key: "email" as const, label: "Email", icon: Mail, inputProps: { id: "email", type: "email" as const, inputMode: "email" as const, autoComplete: "email" as const, placeholder: "you@example.com" }, type: "text" },
    { key: "password" as const, label: "Password", icon: Lock, inputProps: { id: "password", autoComplete: "new-password" as const, placeholder: "At least 8 characters" }, type: "password" },
    { key: "confirmPassword" as const, label: "Confirm password", icon: Lock, inputProps: { id: "confirmPassword", autoComplete: "new-password" as const, placeholder: "Re-enter your password" }, type: "password" },
  ];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {fields.map((field, i) => {
        const Icon = field.icon;
        const fieldKey = field.key;
        const isPassword = fieldKey === "password" || fieldKey === "confirmPassword";

        return (
          <m.div
            key={fieldKey}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 + i * 0.05 }}
            className="flex flex-col gap-2"
          >
            <Label htmlFor={field.inputProps.id}>{field.label}</Label>
            <div className="relative">
              <Icon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                {...field.inputProps}
                type={
                  isPassword && showPassword ? "text" : (field.inputProps.type ?? "text")
                }
                disabled={isSubmitting}
                value={values[fieldKey]}
                onChange={(e) => updateField(fieldKey, e.target.value)}
                className={isPassword ? "pr-9 pl-9" : "pl-9"}
                aria-invalid={touched[fieldKey] && !!errors[fieldKey]}
              />
              {isPassword && (
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
              )}
            </div>
            <FieldError
              error={touched[fieldKey] ? errors[fieldKey] : undefined}
            />
          </m.div>
        );
      })}

      <m.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
        className="flex flex-col gap-2"
      >
        <div className="flex items-center gap-2">
          <Checkbox
            id="terms"
            disabled={isSubmitting}
            checked={values.terms}
            onCheckedChange={(checked) => {
              updateField("terms", checked === true);
            }}
          />
          <Label htmlFor="terms" className="text-sm font-normal">
            I agree to the Terms and Privacy Policy
          </Label>
        </div>
        <FieldError error={touched.terms ? errors.terms : undefined} />
      </m.div>

      <m.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </m.div>

      {footer && (
        <m.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="text-muted-foreground text-center text-sm"
        >
          {footer}
        </m.p>
      )}
    </form>
  );
}
