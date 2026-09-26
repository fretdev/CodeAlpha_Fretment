import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-[#588157] focus:ring-offset-1 focus:ring-offset-[#FFF3B0] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer active:translate-y-[1px]";

    const sizeStyles = {
      sm: "text-xs min-h-[34px] px-3 py-1.5 gap-1.5",
      md: "text-sm min-h-[38px] px-4 py-2 gap-2 tracking-wide",
      lg: "text-sm sm:text-base min-h-[42px] px-5 py-2.5 gap-2.5 font-semibold",
    };

    const variantStyles = {
      primary:
        "bg-[#344E41] text-[#FFFCED] hover:bg-[#20251F] border border-[#344E41] shadow-xs",
      secondary:
        "bg-[#E8EDE1] text-[#20251F] hover:bg-[#D8D8C8] border border-[#D8D8C8]",
      outline:
        "bg-[#FFFCED] text-[#20251F] hover:bg-[#FFF8D6] border border-[#D8D8C8] hover:border-[#A3B18A]",
      ghost:
        "bg-transparent text-[#4D544B] hover:bg-[#FFF8D6] hover:text-[#20251F]",
      danger:
        "bg-[#BC4749] text-[#FFFCED] hover:bg-[#9e3537] border border-[#BC4749]",
      accent:
        "bg-[#588157] text-[#FFFCED] font-semibold hover:bg-[#344E41] border border-[#588157] shadow-xs",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin -ml-0.5 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
