import { Button } from "@codebybit/ui/components/ui/button";
import { Input } from "@codebybit/ui/components/ui/input";
import { Label } from "@codebybit/ui/components/ui/label";
import { Eye, EyeOff, Loader2, User, Lock } from "lucide-react";
import { useCallback, useState } from "react";

export interface SignInValues {
  email: string;
  password: string;
}

export type SignInStatus = "idle" | "loading" | "success" | "error";

interface SignInFormProps {
  status?: SignInStatus;
  onSubmit?: (values: SignInValues) => void | Promise<void>;
  footer?: React.ReactNode;
}

export function SignInForm({
  status = "idle",
  onSubmit,
  footer,
}: SignInFormProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="flex flex-col gap-2">
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
            className="pl-9"
            aria-invalid={touched.email && !!errors.email}
          />
        </div>
        {touched.email && errors.email && (
          <p className="text-destructive text-xs">{errors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
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
        {touched.password && errors.password && (
          <p className="text-destructive text-xs">{errors.password}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      {footer && (
        <p className="text-muted-foreground text-center text-sm">{footer}</p>
      )}
    </form>
  );
}
