import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  active?: boolean;
}

export function Badge({ children, className, active, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border",
        active 
          ? "border-[rgba(16,185,129,0.22)] bg-[rgba(16,185,129,0.09)]" 
          : "border-[rgba(255,255,255,0.1)] bg-transparent",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
