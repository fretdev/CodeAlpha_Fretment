"use client";

import React from "react";
import { Task, TaskStatus } from "@/lib/types";
import { PriorityBadge } from "./PriorityBadge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusChange?: (status: TaskStatus) => void;
}

export function TaskCard({ task, onClick, onStatusChange }: TaskCardProps) {
  const isOverdue =
    task.dueDate &&
    task.status !== "DONE" &&
    new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  return (
    <div
      onClick={onClick}
      className="group relative bg-[#FFFCED] p-3.5 rounded-md border border-[#D8D8C8] hover:border-[#A3B18A] shadow-2xs hover:shadow-xs transition-all duration-150 cursor-pointer flex flex-col justify-between gap-2.5"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <PriorityBadge priority={task.priority} size="sm" />

          {onStatusChange && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative shrink-0"
            >
              <select
                value={task.status}
                onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
                className="text-xs font-semibold text-[#4D544B] bg-[#FFF8D6] hover:bg-[#FFF3B0] border border-[#D8D8C8] rounded px-2 py-0.5 cursor-pointer outline-none transition-colors"
                title="Change status"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          )}
        </div>

        <h4 className="text-sm font-semibold text-[#20251F] leading-snug group-hover:text-[#588157] transition-colors line-clamp-2">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-xs sm:text-[13px] text-[#4D544B] line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-[#E8E8D8] text-xs">
        {task.dueDate ? (
          <div
            className={`flex items-center gap-1.5 font-medium ${
              isOverdue ? "text-[#BC4749]" : "text-[#596057]"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        ) : (
          <span className="text-xs text-[#6B7369]">No date</span>
        )}

        <div className="flex items-center gap-1.5">
          {task.assignee ? (
            <div className="flex items-center gap-1.5" title={`Assigned to ${task.assignee.username}`}>
              <Avatar
                name={task.assignee.username}
                src={task.assignee.avatarUrl}
                size="xs"
              />
              <span className="text-xs font-medium text-[#4D544B] hidden sm:inline max-w-[80px] truncate">
                {task.assignee.username}
              </span>
            </div>
          ) : (
            <span className="text-xs text-[#6B7369] italic">Unassigned</span>
          )}
        </div>
      </div>
    </div>
  );
}
