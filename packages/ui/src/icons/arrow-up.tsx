import GArrowUp from "@gravity-ui/icons/ArrowUp";
import { type SVGProps, forwardRef } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ArrowUp = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <GArrowUp
      ref={ref}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
ArrowUp.displayName = "ArrowUp";
