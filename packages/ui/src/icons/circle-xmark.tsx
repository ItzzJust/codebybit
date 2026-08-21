import GCircleXmark from "@gravity-ui/icons/CircleXmark";
import { type SVGProps, forwardRef } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CircleXmark = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <GCircleXmark
      ref={ref}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
CircleXmark.displayName = "CircleXmark";
