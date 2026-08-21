import GCircleCheck from "@gravity-ui/icons/CircleCheck";
import { type SVGProps, forwardRef } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CircleCheck = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <GCircleCheck
      ref={ref}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
CircleCheck.displayName = "CircleCheck";
