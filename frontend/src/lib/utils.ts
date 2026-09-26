import { TaskPriority, TaskStatus } from "./types";

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function getInitials(name?: string | null): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function formatDate(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return dateString;
  }
}

export function timeAgo(dateString?: string | null): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

export function getPriorityMeta(priority: TaskPriority) {
  switch (priority) {
    case "URGENT":
      return {
        label: "Urgent",
        bg: "bg-[#BC4749]/10 text-[#BC4749] border-[#BC4749]/30",
        dot: "bg-[#BC4749]",
      };
    case "HIGH":
      return {
        label: "High",
        bg: "bg-[#C57B28]/15 text-[#9E5D15] border-[#C57B28]/30",
        dot: "bg-[#C57B28]",
      };
    case "MEDIUM":
      return {
        label: "Medium",
        bg: "bg-[#A3B18A]/30 text-[#344E41] border-[#A3B18A]/50",
        dot: "bg-[#588157]",
      };
    case "LOW":
    default:
      return {
        label: "Low",
        bg: "bg-[#FFF8D6] text-[#4D544B] border-[#D8D8C8]",
        dot: "bg-[#6B7369]",
      };
  }
}

export function getStatusMeta(status: TaskStatus) {
  switch (status) {
    case "DONE":
      return {
        label: "Done",
        bg: "bg-[#588157]/15 text-[#344E41] border-[#588157]/30",
        dot: "bg-[#588157]",
      };
    case "IN_PROGRESS":
      return {
        label: "In Progress",
        bg: "bg-[#C57B28]/15 text-[#9E5D15] border-[#C57B28]/30",
        dot: "bg-[#C57B28]",
      };
    case "TODO":
    default:
      return {
        label: "To Do",
        bg: "bg-[#FFF8D6] text-[#4D544B] border-[#D8D8C8]",
        dot: "bg-[#6B7369]",
      };
  }
}

export const PROJECT_COLORS = [
  "#344E41",
  "#588157",
  "#A3B18A",
  "#C57B28",
  "#BC4749",
  "#20251F",
  "#596057",
  "#8F9489",
];
