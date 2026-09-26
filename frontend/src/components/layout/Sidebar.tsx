"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
      icon: FolderKanban,
      active: pathname.startsWith("/projects"),
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
      active: pathname === "/notifications",
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col w-64 bg-[#FFF8D6] border-r border-[#D8D8C8] h-screen sticky top-0 shrink-0 select-none z-30",
        className
      )}
    >
      <div className="h-16 flex items-center justify-between px-6 border-b border-[#D8D8C8]">
        <Link href="/dashboard" className="flex items-center group">
          <span className="font-display text-2xl tracking-wider text-[#20251F] group-hover:text-[#588157] transition-colors">
            FRETMENT
          </span>
        </Link>
      </div>

      <div className="flex-1 py-5 px-3.5 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-xs font-bold text-[#6B7369] uppercase tracking-widest">
          Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium transition-all group",
                item.active
                  ? "bg-[#344E41] text-[#FFFCED] font-semibold border border-[#344E41] shadow-xs"
                  : "text-[#4D544B] hover:text-[#20251F] hover:bg-[#FFFCED]"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors shrink-0",
                    item.active
                      ? "text-[#FFFCED]"
                      : "text-[#6B7369] group-hover:text-[#20251F]"
                  )}
                />
                <span className="tracking-wide">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded",
                    item.active
                      ? "bg-[#FFFCED] text-[#344E41]"
                      : "bg-[#588157] text-[#FFFCED]"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-3.5 border-t border-[#D8D8C8] bg-[#FFF3B0]/60">
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-[#FFFCED] transition-colors">
          <Link
            href="/profile"
            className="flex items-center gap-2.5 min-w-0 flex-1 group"
          >
            <Avatar name={user?.username} src={user?.avatarUrl} size="sm" />
            <div className="truncate">
              <p className="text-sm font-semibold text-[#20251F] truncate group-hover:text-[#588157] transition-colors">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-[#596057] truncate">
                {user?.email || ""}
              </p>
            </div>
          </Link>
          <button
            onClick={logout}
            title="Sign out"
            className="p-1.5 text-[#6B7369] hover:text-[#BC4749] hover:bg-[#BC4749]/10 rounded transition-colors cursor-pointer"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
