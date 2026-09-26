"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ProjectMemberItem, Task, TaskPriority, TaskStatus } from "@/lib/types";
import { api, ApiError } from "@/lib/api";

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  task: Task | null;
  members: ProjectMemberItem[];
  onSuccess: (task: Task) => void;
}

export function EditTaskModal({
  isOpen,
  onClose,
  projectId,
  task,
  members,
  onSuccess,
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TODO");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status);
      setPriority(task.priority);
      setDueDate(
        task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
      );
      setAssigneeId(task.assignee?.id ? String(task.assignee.id) : "");
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    if (!title.trim() || title.trim().length < 2) {
      setError("Task title must be at least 2 characters.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updated = await api.tasks.update(projectId, task.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        assigneeId: assigneeId ? Number(assigneeId) : undefined,
      });

      onSuccess(updated);
      onClose();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update task. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const memberOptions = [
    { value: "", label: "Unassigned" },
    ...members.map((m) => ({
      value: m.user.id,
      label: `${m.user.username} (${m.user.email || m.role})`,
    })),
  ];

  const statusOptions = [
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
  ];

  const priorityOptions = [
    { value: "LOW", label: "Low Priority" },
    { value: "MEDIUM", label: "Medium Priority" },
    { value: "HIGH", label: "High Priority" },
    { value: "URGENT", label: "Urgent Priority" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Task"
      description="Update status, priority, description, or assignment."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs sm:text-sm font-medium text-[#BC4749] bg-[#BC4749]/10 border border-[#BC4749]/30 rounded-md">
            {error}
          </div>
        )}

        <Input
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
        />

        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={2000}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          />

          <Select
            label="Priority"
            options={priorityOptions}
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Select
            label="Assignee"
            options={memberOptions}
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2.5 pt-4 border-t border-[#D8D8C8]">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={loading} disabled={!title.trim()}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
