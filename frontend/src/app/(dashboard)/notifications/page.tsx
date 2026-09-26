"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { useNotifications } from "@/context/NotificationContext";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { Inbox, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAsUnread,
    markAllAsRead,
  } = useNotifications();

  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  const filteredNotifications = notifications.filter((n) =>
    filter === "UNREAD" ? !n.isRead : true
  );

  return (
    <div className="space-y-6">
      <Header
        title="NOTIFICATIONS"
        subtitle="Real-time alert stream for task assignments, comments, and project invites."
        action={
          unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAllAsRead()}
              leftIcon={<CheckCheck className="w-3.5 h-3.5" />}
            >
              Mark all read
            </Button>
          )
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
        <div className="flex items-center justify-between p-3.5 bg-[#FFFCED] rounded-lg border border-[#D8D8C8] shadow-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                filter === "ALL"
                  ? "bg-[#344E41] text-[#FFFCED] border border-[#344E41]"
                  : "text-[#596057] hover:bg-[#FFF8D6] hover:text-[#20251F]"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("UNREAD")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                filter === "UNREAD"
                  ? "bg-[#344E41] text-[#FFFCED] border border-[#344E41]"
                  : "text-[#596057] hover:bg-[#FFF8D6] hover:text-[#20251F]"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#596057]">
            <span className="w-2 h-2 rounded-full bg-[#588157] animate-pulse" />
            <span className="font-semibold text-[#344E41] text-[10px] uppercase tracking-wider hidden sm:inline">
              ● FRETMENT LIVE
            </span>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Spinner size="lg" label="Syncing notifications..." />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            icon={<Inbox className="w-7 h-7 text-[#7D857B]" />}
            title={
              filter === "UNREAD"
                ? "No unread alerts"
                : "No notifications in inbox"
            }
            description={
              filter === "UNREAD"
                ? "All team updates and task assignments have been reviewed."
                : "Real-time task mentions, comments, and project invites will stream here."
            }
          />
        ) : (
          <div className="space-y-1.5 bg-[#FFFCED] rounded-lg border border-[#D8D8C8] p-2 divide-y divide-[#D8D8C8] shadow-xs">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkRead={markAsRead}
                onMarkUnread={markAsUnread}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
