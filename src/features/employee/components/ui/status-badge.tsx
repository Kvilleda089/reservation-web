// src/components/ui/status-badge.tsx

import { cn } from "cn";


type StatusBadgeVariant = "active" | "inactive";

interface StatusBadgeProps {
  variant: StatusBadgeVariant;
  children: React.ReactNode;
}

export function StatusBadge({
  variant,
  children,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        {
          "bg-green-100 text-green-700": variant === "active",
          "bg-red-100 text-red-700": variant === "inactive",
        },
      )}
    >
      {children}
    </span>
  );
}