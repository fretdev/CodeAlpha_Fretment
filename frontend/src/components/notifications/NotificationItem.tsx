import React from "react";
import { Notification } from "@/lib/types";
import { Avatar } from "@/components/ui/Avatar";
import { timeAgo } from "@/lib/utils";
import { Check, UserPlus, MessageSquare, CheckCircle, Clock } from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead?: (id: number) => void;
  onMarkUnread?: (id: number) => void;
  compact?: boolean;
}

export function NotificationItem({
  notification,
  onMarkRead,
  onMarkUnread,
  compact = false,
}: NotificationItemProps) {
  const getIcon = () => {
    switch (notification.type) {
      case "PROJECT_MEMBER_ADDED":
        return <UserPlus className="w-3.5 h-3.5 text-[#588157]" />;
      case "COMMENT_ADDED":
        return <MessageSquare className="w-3.5 h-3.5 text-[#344E41]" />;
      case "TASK_STATUS_CHANGED":
        return <CheckCircle className="w-3.5 h-3.5 text-[#C57B28]" />;
      case "TASK_ASSIGNED":
      default:
        return <Clock className="w-3.5 h-3.5 text-[#588157]" />;
    }
  };

  return (
    <div
      className={`group flex items-start gap-3 p-3.5 rounded-md transition-colors border ${
        notification.isRead
          ? "bg-[#FFFCED] border-transparent hover:bg-[#FFF8D6]"
          : "bg-[#E8EDE1]/70 border-[#588157]/30 hover:bg-[#E8EDE1]"
      }`}
    >
      <div className="relative shrink-0 mt-0.5">
        <Avatar
          name={notification.actor?.username || "System"}
          src={notification.actor?.avatarUrl}
          size={compact ? "xs" : "sm"}
        />
        <span className="absolute -bottom-1 -right-1 bg-[#FFFCED] rounded p-0.5 border border-[#D8D8C8]">
          {getIcon()}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            notification.isRead
              ? "text-[#4D544B]"
              : "text-[#20251F] font-semibold"
          }`}
        >
          {notification.message}
        </p>
        <div className="flex items-center gap-1.5 mt-1 text-xs text-[#596057]">
          <span>{timeAgo(notification.createdAt)}</span>
          {!notification.isRead && (
            <>
              <span>•</span>
              <span className="text-[#344E41] font-bold">NEW</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0 self-center opacity-80 group-hover:opacity-100 transition-opacity">
        {notification.isRead ? (
          onMarkUnread && (
            <button
              onClick={() => onMarkUnread(notification.id)}
              title="Mark as unread"
              className="px-2 py-1 text-[#596057] hover:text-[#20251F] hover:bg-[#FFF8D6] rounded text-xs transition-colors cursor-pointer"
            >
              Unread
            </button>
          )
        ) : (
          onMarkRead && (
            <button
              onClick={() => onMarkRead(notification.id)}
              title="Mark as read"
              className="p-1.5 text-[#344E41] hover:bg-[#588157]/15 rounded transition-colors cursor-pointer"
              aria-label="Mark as read"
            >
              <Check className="w-4 h-4" />
            </button>
          )
        )}
      </div>
    </div>
  );
}
