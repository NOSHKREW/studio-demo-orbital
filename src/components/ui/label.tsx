import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium text-muted-foreground leading-tight",
  {
    variants: {
      subtle: {
        true: "text-muted-foreground/80",
        false: "",
      },
    },
    defaultVariants: {
      subtle: false,
    },
  },
);

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, subtle, ...props }, ref) => (
    <label
      className={cn(labelVariants({ subtle, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Label.displayName = "Label";

export { Label };
