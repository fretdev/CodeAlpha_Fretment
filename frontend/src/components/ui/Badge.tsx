import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "slate" | "burgundy" | "gold" | "green" | "red" | "dim" | "sage";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "slate",
  size = "md",
  dot = false,
  className,
}: BadgeProps) {
  const variantStyles = {
    slate: "bg-[#FFF8D6] text-[#4D544B] border-[#D8D8C8]",
    burgundy: "bg-[#344E41]/10 text-[#344E41] border-[#344E41]/25",
    sage: "bg-[#A3B18A]/25 text-[#344E41] border-[#A3B18A]/40",
    gold: "bg-[#C57B28]/15 text-[#9E5D15] border-[#C57B28]/30",
    green: "bg-[#588157]/15 text-[#344E41] border-[#588157]/30",
    red: "bg-[#BC4749]/15 text-[#BC4749] border-[#BC4749]/30",
    dim: "bg-[#E8EDE1] text-[#4D544B] border-[#D8D8C8]",
  };

  const dotColors = {
    slate: "bg-[#6B7369]",
    burgundy: "bg-[#344E41]",
    sage: "bg-[#A3B18A]",
    gold: "bg-[#C57B28]",
    green: "bg-[#588157]",
    red: "bg-[#BC4749]",
    dim: "bg-[#6B7369]",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5 font-medium gap-1.5 rounded",
    md: "text-xs sm:text-[13px] px-2.5 py-1 font-medium gap-1.5 rounded",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center border leading-none tracking-tight font-medium",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}
