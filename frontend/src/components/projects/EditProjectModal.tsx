"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { PROJECT_COLORS } from "@/lib/utils";
import { api, ApiError } from "@/lib/api";
import { ProjectDetail } from "@/lib/types";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectDetail | null;
  onSuccess: (project: ProjectDetail) => void;
}

export function EditProjectModal({
  isOpen,
  onClose,
  project,
  onSuccess,
}: EditProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setDescription(project.description || "");
      setColor(project.color || PROJECT_COLORS[0]);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    if (!name.trim() || name.trim().length < 2) {
      setError("Project name must be at least 2 characters long.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const updated = await api.projects.update(project.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        color: color || undefined,
      });
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update project. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project"
      description="Update project details and visual theme."
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
        />

        <Textarea
          label="Description"
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
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
