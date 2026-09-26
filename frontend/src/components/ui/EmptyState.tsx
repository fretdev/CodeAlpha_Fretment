import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-lg border border-dashed border-[#D8D8C8] bg-[#FFFCED]/60",
        className
      )}
    >
      {icon && (
        <div className="mb-3.5 rounded-md bg-[#FFF8D6] p-3 text-[#4D544B] border border-[#D8D8C8]">
          {icon}
        </div>
      )}
      <h3 className="text-sm sm:text-base font-bold text-[#20251F] tracking-tight">{title}</h3>
      {description && (
        <p className="mt-1.5 text-xs sm:text-sm text-[#4D544B] max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
