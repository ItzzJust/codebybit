import GMinus from "@gravity-ui/icons/Minus";
import { type SVGProps, forwardRef } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const Minus = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <GMinus
      ref={ref}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
Minus.displayName = "Minus";
