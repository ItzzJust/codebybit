import GArrowLeft from "@gravity-ui/icons/ArrowLeft";
import { type SVGProps, forwardRef } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ArrowLeft = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <GArrowLeft
      ref={ref}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
ArrowLeft.displayName = "ArrowLeft";
