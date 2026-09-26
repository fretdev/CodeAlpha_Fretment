import React from "react";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const sizeClasses = {
    xs: "w-5 h-5 text-[10px]",
    sm: "w-6 h-6 text-xs",
    md: "w-7 h-7 text-xs font-semibold",
    lg: "w-9 h-9 text-sm font-semibold",
    xl: "w-12 h-12 text-base font-semibold",
  };

  const getAvatarBg = (str?: string | null) => {
    if (!str) return "bg-[#E8EDE1] text-[#4D544B] border-[#D8D8C8]";
    const colors = [
      "bg-[#344E41] text-[#FFFCED] border-[#344E41]",
      "bg-[#588157] text-[#FFFCED] border-[#588157]",
      "bg-[#A3B18A] text-[#20251F] border-[#8F9489]",
      "bg-[#E8EDE1] text-[#344E41] border-[#D8D8C8]",
      "bg-[#FFF8D6] text-[#20251F] border-[#D8D8C8]",
      "bg-[#20251F] text-[#FFFCED] border-[#20251F]",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || "User avatar"}
        className={cn(
          "rounded object-cover border border-[#D8D8C8] shrink-0",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      title={name || "User"}
      className={cn(
        "rounded flex items-center justify-center shrink-0 border font-medium select-none",
        sizeClasses[size],
        getAvatarBg(name),
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
