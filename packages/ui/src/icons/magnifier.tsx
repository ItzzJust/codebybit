import GMagnifier from "@gravity-ui/icons/Magnifier";
import { type SVGProps, forwardRef } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const Magnifier = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <GMagnifier
      ref={ref}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
Magnifier.displayName = "Magnifier";
