import GEllipsis from "@gravity-ui/icons/Ellipsis";
import { type SVGProps, forwardRef } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const Ellipsis = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <GEllipsis
      ref={ref}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
Ellipsis.displayName = "Ellipsis";
