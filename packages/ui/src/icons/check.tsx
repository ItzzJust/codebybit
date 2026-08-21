import GCheck from "@gravity-ui/icons/Check";
import { type SVGProps, forwardRef } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const Check = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <GCheck
      ref={ref}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
Check.displayName = "Check";
