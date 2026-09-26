"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Notification } from "@/lib/types";
import { api } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import { useAuth } from "./AuthContext";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  lastEventTimestamp: number;
  markAsRead: (id: number) => Promise<void>;
  markAsUnread: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastEventTimestamp, setLastEventTimestamp] = useState<number>(Date.now());

  const refreshNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    try {
      setLoading(true);
      const list = await api.notifications.list();
      setNotifications(list);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshNotifications();
    } else {
      setNotifications([]);
    }
  }, [user, refreshNotifications]);

  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket) return;

    const handleNewNotification = (newNotification: Notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === newNotification.id)) {
          return prev;
        }
        return [newNotification, ...prev];
      });
      setLastEventTimestamp(Date.now());
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("fretment:realtime-event", {
            detail: newNotification,
          })
        );
      }
    };

    socket.on("notification", handleNewNotification);

    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [user]);

  const markAsRead = async (id: number) => {
    try {
      const updated = await api.notifications.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAsUnread = async (id: number) => {
    try {
      const updated = await api.notifications.markUnread(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as unread:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        lastEventTimestamp,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
