import GCircleExclamation from "@gravity-ui/icons/CircleExclamation";
import { type SVGProps, forwardRef } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CircleExclamation = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <GCircleExclamation
      ref={ref}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
CircleExclamation.displayName = "CircleExclamation";
