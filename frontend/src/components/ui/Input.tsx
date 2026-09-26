import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
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
        <div className="relative rounded-md">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#6B7369]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "block w-full rounded-md border bg-[#FFFCED] px-3.5 py-2.5 text-sm text-[#20251F] placeholder:text-[#6B7369] transition-colors focus:border-[#588157] focus:outline-none focus:ring-1 focus:ring-[#588157] disabled:cursor-not-allowed disabled:bg-[#FFF8D6] disabled:text-[#6B7369]",
              leftIcon ? "pl-10" : "",
              rightIcon ? "pr-10" : "",
              error
                ? "border-[#BC4749] focus:border-[#BC4749] focus:ring-[#BC4749]"
                : "border-[#D8D8C8] hover:border-[#A3B18A]",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#6B7369]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs font-medium text-[#BC4749]">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#596057]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
