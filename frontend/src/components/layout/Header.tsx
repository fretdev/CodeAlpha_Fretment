"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { Avatar } from "@/components/ui/Avatar";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onOpenMobileNav?: () => void;
  action?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  action,
}: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-[#FFF8D6] border-b border-[#D8D8C8] px-4 py-3 md:py-0 md:h-16 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-14 md:top-0 z-20 shrink-0">
      <div className="flex items-center justify-between min-w-0 flex-1">
        {title && (
          <div className="min-w-0 pr-2">
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-[#20251F] leading-tight tracking-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#4D544B] mt-0.5 line-clamp-1 sm:line-clamp-none">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="sm:hidden shrink-0">{action}</div>
      </div>

      <div className="hidden sm:flex items-center gap-3 shrink-0">
        {action}
        <div className="hidden md:flex items-center gap-3">
          <NotificationDropdown />
          <div className="h-4 w-px bg-[#D8D8C8]" />
          <Link
            href="/profile"
            className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-[#FFFCED] transition-colors"
          >
            <Avatar name={user?.username} src={user?.avatarUrl} size="sm" />
            <span className="text-sm font-semibold text-[#4D544B] hover:text-[#20251F] max-w-[140px] truncate">
              {user?.username}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
