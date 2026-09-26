import React from "react";
import { TaskPriority } from "@/lib/types";
import { getPriorityMeta } from "@/lib/utils";
import { AlertCircle, ArrowUp, ArrowDown, Minus } from "lucide-react";

interface PriorityBadgeProps {
  priority: TaskPriority;
  size?: "sm" | "md";
}

export function PriorityBadge({ priority, size = "md" }: PriorityBadgeProps) {
  const meta = getPriorityMeta(priority);

  const getIcon = () => {
    switch (priority) {
      case "URGENT":
        return <AlertCircle className="w-3 h-3 text-[#BC4749]" />;
      case "HIGH":
        return <ArrowUp className="w-3 h-3 text-[#C57B28]" />;
      case "MEDIUM":
        return <Minus className="w-3 h-3 text-[#588157]" />;
      case "LOW":
      default:
        return <ArrowDown className="w-3 h-3 text-[#6B7369]" />;
    }
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1.5 rounded",
    md: "text-xs sm:text-[13px] px-2.5 py-1 gap-1.5 rounded",
  };

  return (
    <span
      className={`inline-flex items-center font-medium border leading-none tracking-tight ${meta.bg} ${sizeClasses[size]}`}
    >
      {getIcon()}
      <span>{meta.label}</span>
    </span>
  );
}
