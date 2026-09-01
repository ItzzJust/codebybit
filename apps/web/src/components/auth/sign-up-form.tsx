import { Button } from "@codebybit/ui/components/ui/button";
import { Checkbox } from "@codebybit/ui/components/ui/checkbox";
import { Input } from "@codebybit/ui/components/ui/input";
import { Label } from "@codebybit/ui/components/ui/label";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
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
  errorMessage?: string;
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
  errorMessage,
  onSubmit,
  footer,
}: SignUpFormProps) {
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

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Name</Label>
        <div className="relative">
          <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="name"
            autoComplete="name"
            placeholder="Your name"
            disabled={isSubmitting}
            value={values.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="pl-9"
            aria-invalid={touched.name && !!errors.name}
          />
        </div>
        <FieldError error={touched.name ? errors.name : undefined} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isSubmitting}
            value={values.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="pl-9"
            aria-invalid={touched.email && !!errors.email}
          />
        </div>
        <FieldError error={touched.email ? errors.email : undefined} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            disabled={isSubmitting}
            value={values.password}
            onChange={(e) => updateField("password", e.target.value)}
            className="pr-9 pl-9"
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
        <FieldError error={touched.password ? errors.password : undefined} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            disabled={isSubmitting}
            value={values.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
            className="pl-9"
            aria-invalid={touched.confirmPassword && !!errors.confirmPassword}
          />
        </div>
        <FieldError
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
        />
      </div>

      <div className="flex flex-col gap-2">
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
      </div>

      {errorMessage && (
        <div className="bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-sm">
          {errorMessage}
        </div>
      )}

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

      {footer && (
        <p className="text-muted-foreground text-center text-sm">{footer}</p>
      )}
    </form>
  );
}
