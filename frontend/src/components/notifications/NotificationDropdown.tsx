"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationItem } from "./NotificationItem";

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAsUnread, markAllAsRead } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#4D544B] hover:text-[#20251F] hover:bg-[#FFFCED] rounded-md transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded bg-[#588157] px-1 text-[10px] font-bold text-[#FFFCED] shadow-xs">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg bg-[#FFFCED] shadow-xl border border-[#D8D8C8] z-50 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-100">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#D8D8C8] bg-[#FFF8D6]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-[#20251F] uppercase tracking-wider">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-xs bg-[#588157]/15 text-[#344E41] border border-[#588157]/30 font-bold px-2 py-0.5 rounded">
                  {unreadCount} UNREAD
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-[#4D544B] hover:text-[#344E41] font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-[#D8D8C8]/60 p-2 space-y-1.5">
            {recentNotifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="w-6 h-6 text-[#6B7369] mx-auto mb-2" />
                <p className="text-sm font-semibold text-[#4D544B]">
                  No notifications yet
                </p>
                <p className="text-xs text-[#596057] mt-0.5">
                  You will see activity updates here.
                </p>
              </div>
            ) : (
              recentNotifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onMarkRead={markAsRead}
                  onMarkUnread={markAsUnread}
                  compact
                />
              ))
            )}
          </div>

          <div className="p-2.5 border-t border-[#D8D8C8] bg-[#FFF8D6] text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs sm:text-sm font-bold text-[#344E41] hover:text-[#588157] block py-1 tracking-wide uppercase"
            >
              View all notifications &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
