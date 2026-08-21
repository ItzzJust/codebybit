import { cn } from "@codebybit/ui/lib/utils";
import { Loader } from "lucide-react";
import type { ComponentProps } from "react";

type SpinnerProps = Omit<ComponentProps<"svg">, "ref">;

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <Loader
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
