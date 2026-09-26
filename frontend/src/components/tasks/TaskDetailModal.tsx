"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { CommentList } from "@/components/comments/CommentList";
import { CommentForm } from "@/components/comments/CommentForm";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Comment, ProjectMemberItem, Task, TaskPriority, TaskStatus } from "@/lib/types";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/lib/utils";
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  MessageSquare,
} from "lucide-react";

interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  taskId: number | null;
  members: ProjectMemberItem[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: number) => void;
  onOpenEditModal: (task: Task) => void;
}

export function TaskDetailModal({
  isOpen,
  onClose,
  projectId,
  taskId,
  members,
  onTaskUpdated,
  onTaskDeleted,
  onOpenEditModal,
}: TaskDetailModalProps) {
  const { user: currentUser } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen && taskId) {
      loadTaskAndComments();
    } else {
      setTask(null);
      setComments([]);
    }
  }, [isOpen, taskId]);

  const loadTaskAndComments = async () => {
    if (!taskId) return;
    try {
      setLoading(true);
      const [fetchedTask, fetchedComments] = await Promise.all([
        api.tasks.get(projectId, taskId),
        api.comments.list(projectId, taskId),
      ]);
      setTask(fetchedTask);
      setComments(fetchedComments);
    } catch (err) {
      console.error("Failed to load task details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStatusChange = async (newStatus: TaskStatus) => {
    if (!task) return;
    try {
      const updated = await api.tasks.update(projectId, task.id, {
        status: newStatus,
      });
      setTask(updated);
      onTaskUpdated(updated);
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleQuickPriorityChange = async (newPriority: TaskPriority) => {
    if (!task) return;
    try {
      const updated = await api.tasks.update(projectId, task.id, {
        priority: newPriority,
      });
      setTask(updated);
      onTaskUpdated(updated);
    } catch (err: any) {
      alert(err.message || "Failed to update priority");
    }
  };

  const handleAddComment = async (content: string) => {
    if (!task) return;
    const newComment = await api.comments.create(projectId, task.id, {
      content,
    });
    setComments((prev) => [...prev, newComment]);
  };

  const handleUpdateComment = async (commentId: number, content: string) => {
    if (!task) return;
    const updated = await api.comments.update(projectId, task.id, commentId, {
      content,
    });
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? updated : c))
    );
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!task) return;
    await api.comments.delete(projectId, task.id, commentId);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    try {
      setIsDeleting(true);
      await api.tasks.delete(projectId, task.id);
      setShowDeleteConfirm(false);
      onTaskDeleted(task.id);
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        {loading || !task ? (
          <div className="py-16 text-center text-sm text-[#596057]">
            Loading task details...
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4 pb-3.5 border-b border-[#D8D8C8]">
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={task.status} />
                <PriorityBadge priority={task.priority} />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => onOpenEditModal(task)}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-[#BC4749] hover:text-[#BC4749] hover:bg-[#BC4749]/10"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2.5">
              <h2 className="text-lg sm:text-xl font-bold text-[#20251F] tracking-tight leading-snug">
                {task.title}
              </h2>
              <p className="text-sm text-[#20251F] whitespace-pre-wrap leading-relaxed bg-[#FFF8D6] p-4 rounded-md border border-[#D8D8C8]">
                {task.description || (
                  <span className="text-[#596057] italic">
                    No description provided.
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 p-4 rounded-md bg-[#FFF8D6] border border-[#D8D8C8] text-xs">
              <div className="space-y-1">
                <span className="font-bold text-[#6B7369] uppercase tracking-wider block text-xs">
                  Assignee
                </span>
                <div className="flex items-center gap-2 pt-0.5">
                  <Avatar
                    name={task.assignee?.username}
                    src={task.assignee?.avatarUrl}
                    size="xs"
                  />
                  <span className="font-medium text-[#20251F] truncate text-sm">
                    {task.assignee?.username || "Unassigned"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#6B7369] uppercase tracking-wider block text-xs">
                  Created By
                </span>
                <div className="flex items-center gap-2 pt-0.5">
                  <Avatar
                    name={task.creator?.username}
                    src={task.creator?.avatarUrl}
                    size="xs"
                  />
                  <span className="font-medium text-[#20251F] truncate text-sm">
                    {task.creator?.username || "Unknown"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#6B7369] uppercase tracking-wider block text-xs">
                  Due Date
                </span>
                <div className="flex items-center gap-1.5 pt-0.5 font-medium text-[#20251F] text-sm">
                  <Calendar className="w-3.5 h-3.5 text-[#596057]" />
                  <span>{task.dueDate ? formatDate(task.dueDate) : "None"}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-[#6B7369] uppercase tracking-wider block text-xs">
                  Created
                </span>
                <div className="flex items-center gap-1.5 pt-0.5 font-medium text-[#20251F] text-sm">
                  <Clock className="w-3.5 h-3.5 text-[#596057]" />
                  <span>{formatDate(task.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 p-3.5 bg-[#FFF8D6] rounded-md border border-[#D8D8C8]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#6B7369] text-xs uppercase tracking-wider">
                  Status:
                </span>
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleQuickStatusChange(e.target.value as TaskStatus)
                  }
                  className="bg-[#FFFCED] hover:bg-[#FFF3B0] text-[#20251F] text-xs sm:text-sm font-medium rounded-md px-2.5 py-1 outline-none cursor-pointer border border-[#D8D8C8]"
                >
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="DONE">Done</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-[#6B7369] text-xs uppercase tracking-wider">
                  Priority:
                </span>
                <select
                  value={task.priority}
                  onChange={(e) =>
                    handleQuickPriorityChange(e.target.value as TaskPriority)
                  }
                  className="bg-[#FFFCED] hover:bg-[#FFF3B0] text-[#20251F] text-xs sm:text-sm font-medium rounded-md px-2.5 py-1 outline-none cursor-pointer border border-[#D8D8C8]"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            <div className="space-y-3.5 pt-3.5 border-t border-[#D8D8C8]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#588157]" />
                <h3 className="text-xs sm:text-sm font-bold text-[#20251F] uppercase tracking-wider">
                  Discussion Thread ({comments.length})
                </h3>
              </div>

              <CommentList
                comments={comments}
                currentUser={currentUser}
                onUpdateComment={handleUpdateComment}
                onDeleteComment={handleDeleteComment}
              />

              <div className="pt-2">
                <CommentForm onSubmit={handleAddComment} />
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message={`Are you sure you want to delete "${task?.title}"? All associated comments will also be permanently removed.`}
        confirmText="Delete Task"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
