import React from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-[#4D544B] tracking-wider uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "block w-full rounded-md border bg-[#FFFCED] px-3.5 py-2.5 pr-9 text-sm text-[#20251F] transition-colors appearance-none focus:border-[#588157] focus:outline-none focus:ring-1 focus:ring-[#588157] disabled:cursor-not-allowed disabled:bg-[#FFF8D6] disabled:text-[#6B7369]",
              error
                ? "border-[#BC4749] focus:border-[#BC4749] focus:ring-[#BC4749]"
                : "border-[#D8D8C8] hover:border-[#A3B18A]",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-[#FFFCED] text-[#6B7369]">
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#FFFCED] text-[#20251F]">
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6B7369]">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {error && <p className="text-xs font-medium text-[#BC4749]">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-[#596057]">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
