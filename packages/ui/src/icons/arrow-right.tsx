import GArrowRight from "@gravity-ui/icons/ArrowRight";
import { type SVGProps, forwardRef } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ArrowRight = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <GArrowRight
      ref={ref}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
ArrowRight.displayName = "ArrowRight";
