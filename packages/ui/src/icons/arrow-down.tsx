import GArrowDown from "@gravity-ui/icons/ArrowDown";
import { type SVGProps, forwardRef } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ArrowDown = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <GArrowDown
      ref={ref}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
ArrowDown.displayName = "ArrowDown";
