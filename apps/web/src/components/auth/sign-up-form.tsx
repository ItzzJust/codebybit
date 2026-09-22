import { Button } from "@codebybit/ui/components/ui/button";
import { Checkbox } from "@codebybit/ui/components/ui/checkbox";
import { Input } from "@codebybit/ui/components/ui/input";
import { Label } from "@codebybit/ui/components/ui/label";
import { Eye, EyeOff, Lock, Loader2, Mail, User } from "lucide-react";
import { m, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

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
  footer?: ReactNode;
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

interface TextFieldProps {
  autoComplete?: string;
  delay?: number;
  disabled?: boolean;
  error?: string;
  icon: ReactNode;
  id: string;
  inputMode?: "email" | "text";
  label: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  type?: string;
  value: string;
}

function TextField({
  autoComplete,
  delay = 0,
  disabled,
  error,
  icon,
  id,
  inputMode,
  label,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  value,
}: TextFieldProps) {
  const reduce = useReducedMotion();
  return (
    <m.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex flex-col gap-2"
    >
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
          {icon}
        </span>
        <Input
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="h-11 pl-9"
          aria-invalid={!!error}
        />
      </div>
      <FieldError error={error} />
    </m.div>
  );
}

interface PasswordFieldProps {
  autoComplete: string;
  delay?: number;
  disabled?: boolean;
  error?: string;
  id: string;
  label: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onTogglePassword: () => void;
  placeholder: string;
  showPassword: boolean;
  value: string;
}

function PasswordField({
  autoComplete,
  delay = 0,
  disabled,
  error,
  id,
  label,
  onChange,
  onBlur,
  onTogglePassword,
  placeholder,
  showPassword,
  value,
}: PasswordFieldProps) {
  const reduce = useReducedMotion();
  return (
    <m.div
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex flex-col gap-2"
    >
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="h-11 pr-9 pl-9"
          aria-invalid={!!error}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={onTogglePassword}
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
      <FieldError error={error} />
    </m.div>
  );
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
    Partial<Record<keyof SignUpValues, string | null>>
  >({});
  const [touched, setTouched] = useState<
    Partial<Record<keyof SignUpValues, boolean>>
  >({});
  const [showPassword, setShowPassword] = useState(false);

  const isSubmitting = status === "loading";

  const updateField = <K extends keyof SignUpValues>(
    key: K,
    value: SignUpValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleBlur = (key: keyof SignUpValues) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    const errs = validateSignUp(values);
    setErrors((prev) => ({ ...prev, [key]: errs[key] }));
  };

  const handleSubmit = async (e: FormEvent) => {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Heading */}
      <m.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-1.5"
      >
        <h1 className="text-2xl font-bold tracking-tight">
          Create your account
        </h1>
        <p className="text-muted-foreground text-sm">
          Join CodeByBit to discover and share resources.
        </p>
      </m.div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          id="name"
          label="Name"
          icon={<User className="size-4" />}
          placeholder="Your name"
          autoComplete="name"
          disabled={isSubmitting}
          value={values.name}
          error={touched.name ? errors.name : undefined}
          onChange={(value) => updateField("name", value)}
          onBlur={() => handleBlur("name")}
          delay={0.05}
        />
        <TextField
          id="email"
          label="Email"
          icon={<Mail className="size-4" />}
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          type="email"
          disabled={isSubmitting}
          value={values.email}
          error={touched.email ? errors.email : undefined}
          onChange={(value) => updateField("email", value)}
          onBlur={() => handleBlur("email")}
          delay={0.1}
        />
      </div>

      {/* Password + Confirm */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PasswordField
          id="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          disabled={isSubmitting}
          value={values.password}
          error={touched.password ? errors.password : undefined}
          onChange={(value) => updateField("password", value)}
          onBlur={() => handleBlur("password")}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((prev) => !prev)}
          delay={0.15}
        />
        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          disabled={isSubmitting}
          value={values.confirmPassword}
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
          onChange={(value) => updateField("confirmPassword", value)}
          onBlur={() => handleBlur("confirmPassword")}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword((prev) => !prev)}
          delay={0.2}
        />
      </div>

      {/* Terms */}
      <m.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
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

      {/* Submit */}
      <m.div
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <Button type="submit" disabled={isSubmitting} className="h-11 w-full">
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
        <m.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.3 }}
          className="text-muted-foreground text-center text-sm"
        >
          {footer}
        </m.div>
      )}
    </form>
  );
}
