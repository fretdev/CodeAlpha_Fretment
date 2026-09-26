import React from "react";
import { TaskStatus } from "@/lib/types";
import { getStatusMeta } from "@/lib/utils";

interface StatusBadgeProps {
  status: TaskStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const meta = getStatusMeta(status);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1.5 rounded",
    md: "text-xs sm:text-[13px] px-2.5 py-1 gap-1.5 rounded",
  };

  return (
    <span
      className={`inline-flex items-center font-medium border leading-none tracking-tight ${meta.bg} ${sizeClasses[size]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />
      <span>{meta.label}</span>
    </span>
  );
}
