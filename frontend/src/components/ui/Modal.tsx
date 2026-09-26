"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#20251F]/50 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full bg-[#FFFCED] rounded-lg shadow-xl border border-[#D8D8C8] overflow-hidden transform transition-all duration-200 z-10 my-8",
          sizeClasses[size]
        )}
      >
        {(title || description) && (
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-[#D8D8C8]">
            <div>
              {title && (
                <h3 className="text-base sm:text-lg font-bold text-[#20251F] tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-xs sm:text-sm text-[#4D544B] leading-relaxed">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-[#6B7369] hover:text-[#20251F] rounded p-1 hover:bg-[#FFF8D6] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {!title && !description && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#6B7369] hover:text-[#20251F] rounded p-1 hover:bg-[#FFF8D6] transition-colors cursor-pointer z-10"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="p-6 text-[#20251F]">{children}</div>
      </div>
    </div>
  );
}
