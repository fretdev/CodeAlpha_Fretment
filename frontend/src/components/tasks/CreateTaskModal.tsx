"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { ProjectMemberItem, Task } from "@/lib/types";
import { api, ApiError } from "@/lib/api";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  members: ProjectMemberItem[];
  defaultStatus?: "TODO" | "IN_PROGRESS" | "DONE";
  onSuccess: (task: Task) => void;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  projectId,
  members,
  defaultStatus = "TODO",
  onSuccess,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 2) {
      setError("Task title must be at least 2 characters.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const createdTask = await api.tasks.create(projectId, {
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        assigneeId: assigneeId ? Number(assigneeId) : undefined,
      });

      if (defaultStatus !== "TODO") {
        const updated = await api.tasks.update(projectId, createdTask.id, {
          status: defaultStatus,
        });
        onSuccess(updated);
      } else {
        onSuccess(createdTask);
      }

      setTitle("");
      setDescription("");
      setDueDate("");
      setAssigneeId("");
      onClose();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create task. Please try again.");
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      description="Add a task item to your project board."
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
          placeholder="e.g. Implement authentication token verification"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
        />

        <Textarea
          label="Description (Optional)"
          placeholder="Technical specifications, acceptance criteria, or notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={2000}
        />

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
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
