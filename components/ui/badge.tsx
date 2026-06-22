import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#f1f3f7] text-[#4b5568]",
        blue:    "bg-[#003DA5]/10 text-[#003DA5]",
        red:     "bg-[#C8102E]/10 text-[#C8102E]",
        green:   "bg-[#15803D]/10 text-[#15803D]",
        amber:   "bg-amber-50 text-amber-700",
        outline: "border border-[var(--border)] text-[#6b7280]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function categoryBadgeVariant(category: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    "Fútbol":       "green",
    "Básquet":      "green",
    "Hockey":       "green",
    "Patín":        "green",
    "Gimnasia":     "green",
    "Eventos":      "green",
    "Institucional":"default",
    "Cuotas":       "amber",
    "Comunicados":  "default",
  };
  return map[category] ?? "default";
}
