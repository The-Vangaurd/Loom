import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-on-accent font-semibold hover:brightness-105 shadow-[0_0_20px_var(--accent-soft)]",
        secondary:
          "bg-surface-2 text-text-primary border border-border-strong hover:bg-surface-3",
        ghost:
          "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
        destructive:
          "border border-danger text-danger hover:bg-danger-soft",
        destructiveSolid:
          "bg-danger text-on-accent hover:brightness-105 font-medium",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-control",
        sm: "h-8 rounded-control px-3 text-xs",
        lg: "h-12 rounded-control px-6 text-base",
        icon: "h-10 w-10 rounded-control",
        dense: "h-9 px-3 rounded-control text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
