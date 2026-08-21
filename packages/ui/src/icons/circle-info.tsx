import GCircleInfo from "@gravity-ui/icons/CircleInfo";
import { type SVGProps, forwardRef } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CircleInfo = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <GCircleInfo
      ref={ref}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
CircleInfo.displayName = "CircleInfo";
