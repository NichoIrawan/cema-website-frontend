import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // Primary green button - main CTA
        default: "bg-primary text-primary-foreground hover:bg-[#7AB84A] shadow-md hover:shadow-lg",
        // Outlined button with green border
        outline:
          "border-2 border-primary bg-background text-primary hover:bg-muted",
        // Ghost button - transparent with green text
        ghost:
          "text-primary hover:bg-primary/10",
        // Secondary gray button
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md",
        // Destructive/danger button
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md",
        // Warning/yellow button
        warning:
          "bg-warning text-warning-foreground hover:bg-warning/90 shadow-md",
        // Link style button
        link: "text-primary underline-offset-4 hover:underline",
        // White button with subtle styling
        white: "bg-white text-primary border-2 border-transparent hover:border-primary shadow-md",
      },
      size: {
        sm: "h-9 px-3 py-2 text-sm rounded-lg has-[>svg]:px-2.5",
        default: "h-11 px-6 py-3 text-base rounded-lg has-[>svg]:px-4",
        lg: "h-12 px-8 py-4 text-lg rounded-xl has-[>svg]:px-6",
        xl: "h-14 px-10 py-4 text-lg rounded-xl has-[>svg]:px-8",
        icon: "size-10 rounded-lg",
        "icon-sm": "size-9 rounded-lg",
      },
      rounded: {
        default: "",
        full: "rounded-full",
        lg: "rounded-lg",
        xl: "rounded-xl",
        "2xl": "rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, rounded, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
