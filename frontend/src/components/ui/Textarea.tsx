import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#4D544B] tracking-wider uppercase"
          >
            {label}
          </label>
        )}
        <textarea
          id={inputId}
          ref={ref}
          rows={rows}
          className={cn(
            "block w-full rounded-md border bg-[#FFFCED] px-3.5 py-2.5 text-sm text-[#20251F] placeholder:text-[#6B7369] transition-colors focus:border-[#588157] focus:outline-none focus:ring-1 focus:ring-[#588157] disabled:cursor-not-allowed disabled:bg-[#FFF8D6] disabled:text-[#6B7369]",
            error
              ? "border-[#BC4749] focus:border-[#BC4749] focus:ring-[#BC4749]"
              : "border-[#D8D8C8] hover:border-[#A3B18A]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs font-medium text-[#BC4749]">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#596057]">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
