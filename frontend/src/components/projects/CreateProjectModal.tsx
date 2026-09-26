"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { PROJECT_COLORS } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import { ProjectDetail } from "@/lib/types";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (project: ProjectDetail) => void;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      setError("Project name must be at least 2 characters long.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const project = await api.projects.create({
        name: name.trim(),
        description: description.trim() || undefined,
        color: color || undefined,
      });
      setName("");
      setDescription("");
      setColor(PROJECT_COLORS[0]);
      onSuccess(project);
      onClose();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to create project. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Set up a workspace for your team tasks and milestones."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs sm:text-sm font-medium text-[#BC4749] bg-[#BC4749]/10 border border-[#BC4749]/30 rounded-md">
            {error}
          </div>
        )}

        <Input
          label="Project Name"
          placeholder="e.g. Core Engine Architecture"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
        />

        <Textarea
          label="Description (Optional)"
          placeholder="Summarize the goals and scope of this project..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          maxLength={1000}
        />

        <div>
          <label className="block text-xs font-semibold text-[#4D544B] tracking-wider uppercase mb-2">
            Theme Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PROJECT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-6 h-6 rounded transition-transform cursor-pointer flex items-center justify-center ${
                  color === c
                    ? "ring-2 ring-offset-2 ring-offset-[#FFFCED] ring-[#344E41] scale-110"
                    : "hover:scale-105 opacity-80"
                }`}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
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
          <Button type="submit" isLoading={loading} disabled={!name.trim()}>
            Create Project
          </Button>
        </div>
      </form>
    </Modal>
  );
}
