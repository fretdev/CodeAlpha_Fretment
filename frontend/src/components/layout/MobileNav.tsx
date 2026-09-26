"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Bell,
  LogOut,
  User as UserIcon,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

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
    {
      label: "Profile",
      href: "/profile",
      icon: UserIcon,
      active: pathname === "/profile",
    },
  ];

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 md:hidden transition-all duration-200",
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      )}
      aria-hidden={!isOpen}
    >
      <div
        className={cn(
          "fixed inset-0 bg-[#20251F]/50 backdrop-blur-xs transition-opacity duration-200 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "relative w-[85%] max-w-xs bg-[#FFF8D6] border-r border-[#D8D8C8] h-full flex flex-col z-10 shadow-2xl transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#D8D8C8] bg-[#FFF3B0]">
          <Link href="/dashboard" onClick={onClose} className="flex items-center">
            <span className="font-display text-2xl tracking-widest text-[#20251F]">
              FRETMENT
            </span>
          </Link>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#4D544B] hover:text-[#20251F] hover:bg-[#FFFCED] rounded-md transition-colors cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 py-5 px-3.5 space-y-1.5 overflow-y-auto">
          <div className="px-3 mb-2 text-xs font-bold text-[#6B7369] uppercase tracking-widest">
            Workspace
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors",
                  item.active
                    ? "bg-[#344E41] text-[#FFFCED] font-semibold border border-[#344E41] shadow-xs"
                    : "text-[#4D544B] hover:bg-[#FFFCED] hover:text-[#20251F]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0",
                      item.active ? "text-[#FFFCED]" : "text-[#6B7369]"
                    )}
                  />
                  <span className="tracking-wide">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded",
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
          <div className="flex items-center justify-between p-2.5 rounded-md bg-[#FFFCED] border border-[#D8D8C8]">
            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-2.5 min-w-0 flex-1"
            >
              <Avatar name={user?.username} src={user?.avatarUrl} size="sm" />
              <div className="truncate pr-2">
                <p className="text-sm font-semibold text-[#20251F] truncate">
                  {user?.username || "User"}
                </p>
                <p className="text-xs text-[#596057] truncate">
                  {user?.email || ""}
                </p>
              </div>
            </Link>
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[#6B7369] hover:text-[#BC4749] hover:bg-[#BC4749]/10 rounded transition-colors cursor-pointer"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
