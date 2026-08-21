import GXmark from "@gravity-ui/icons/Xmark";
import { type SVGProps, forwardRef } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const Xmark = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, className, ...props }, ref) => (
    <GXmark
      ref={ref}
      width={size}
      height={size}
      className={className}
      {...props}
    />
  )
);
Xmark.displayName = "Xmark";
