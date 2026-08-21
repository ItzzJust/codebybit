"use client";

import { forwardRef } from "react";

import { Magnetic } from "../magnetic";
import { Button } from "./base";
import type { ButtonProps } from "./base";

export interface MagneticButtonProps extends ButtonProps {
  /** Magnetic pull strength. Default 0.25. */
  strength?: number;
  /** Class applied to the magnetic wrapper. */
  magneticClassName?: string;
}

export const MagneticButton = forwardRef<
  HTMLButtonElement,
  MagneticButtonProps
>(({ strength = 0.25, magneticClassName, children, ...rest }, ref) => (
  <Magnetic strength={strength} className={magneticClassName}>
    <Button ref={ref} {...rest}>
      {children}
    </Button>
  </Magnetic>
));
