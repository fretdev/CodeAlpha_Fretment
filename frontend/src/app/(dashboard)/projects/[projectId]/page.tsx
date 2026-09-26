"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { MembersModal } from "@/components/projects/MembersModal";
import { EditProjectModal } from "@/components/projects/EditProjectModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { api, ApiError } from "@/lib/api";
import { ProjectDetail, Task } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  FolderKanban,
  Users,
  Settings,
  Trash2,
  ChevronLeft,
} from "lucide-react";

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { lastEventTimestamp } = useNotifications();
  const unwrappedParams = use(params);
  const projectId = Number(unwrappedParams.projectId);

  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchProjectAndTasks = async (isSilent = false) => {
    if (!Number.isInteger(projectId) || projectId <= 0) {
      setError("Invalid project ID");
      if (!isSilent) setLoading(false);
      return;
    }

    try {
      if (!isSilent) setLoading(true);
      setError(null);
      const [projData, taskData] = await Promise.all([
        api.projects.get(projectId),
        api.tasks.list(projectId),
      ]);
      setProject(projData);
      setTasks(taskData);
    } catch (err: any) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load project details.");
      }
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  useEffect(() => {
    if (lastEventTimestamp && projectId) {
      fetchProjectAndTasks(true);
    }
  }, [lastEventTimestamp, projectId]);

  const isOwner =
    project?.owner?.id === user?.id ||
    project?.members.some(
      (m) => m.user.id === user?.id && m.role === "OWNER"
    );

  const handleDeleteProject = async () => {
    try {
      setDeleting(true);
      await api.projects.delete(projectId);
      router.push("/projects");
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Header title="LOADING WORKSPACE..." />
        <div className="py-24 text-center">
          <Spinner size="lg" label="Loading project workspace..." />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <Header title="PROJECT ERROR" />
        <div className="max-w-xl mx-auto px-4 py-16">
          <EmptyState
            icon={<FolderKanban className="w-7 h-7 text-[#BC4749]" />}
            title="Project Unavailable"
            description={
              error ||
              "The requested project could not be found or you do not have permission to access it."
            }
            action={
              <Link href="/projects">
                <Button
                  variant="outline"
                  leftIcon={<ChevronLeft className="w-4 h-4" />}
                >
                  Back to Projects
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const projectColor = project.color || "#344E41";

  return (
    <div className="space-y-6">
      <Header
        title={project.name.toUpperCase()}
        subtitle={project.description || "Workspace Board"}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMembersOpen(true)}
              leftIcon={<Users className="w-3.5 h-3.5" />}
            >
              Members ({project.members.length})
            </Button>

            {isOwner && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditOpen(true)}
                  leftIcon={<Settings className="w-3.5 h-3.5" />}
                >
                  Settings
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="text-[#BC4749] hover:text-[#BC4749] hover:bg-[#BC4749]/10"
                  aria-label="Delete project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
        <div className="bg-[#FFFCED] rounded-lg border border-[#D8D8C8] p-5 relative overflow-hidden shadow-xs">
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: projectColor }}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
            <div className="space-y-1.5 max-w-3xl">
              <div className="flex items-center gap-2.5 flex-wrap">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-[#20251F] shrink-0"
                  style={{
                    backgroundColor: `${projectColor}20`,
                    border: `1px solid ${projectColor}55`,
                  }}
                >
                  <FolderKanban
                    className="w-4 h-4"
                    style={{ color: projectColor }}
                  />
                </div>
                <div>
                  <h1 className="text-base font-bold text-[#20251F] tracking-tight">
                    {project.name}
                  </h1>
                  <div className="flex items-center gap-2 text-[11px] text-[#7D857B] mt-0.5">
                    <span>Created {formatDate(project.createdAt)}</span>
                    <span>•</span>
                    <Badge variant={isOwner ? "green" : "slate"} size="sm">
                      {isOwner ? "OWNER" : "MEMBER"}
                    </Badge>
                  </div>
                </div>
              </div>

              {project.description && (
                <p className="text-xs text-[#596057] leading-relaxed pt-1">
                  {project.description}
                </p>
              )}
            </div>

            <div
              onClick={() => setIsMembersOpen(true)}
              className="flex items-center gap-2.5 bg-[#FFF8D6] p-2.5 rounded-md border border-[#D8D8C8] cursor-pointer hover:border-[#A3B18A] transition-colors shrink-0 shadow-2xs"
            >
              <div className="flex -space-x-1.5 overflow-hidden">
                {project.members.slice(0, 4).map((m) => (
                  <Avatar
                    key={m.id}
                    name={m.user.username}
                    src={m.user.avatarUrl}
                    size="xs"
                    className="ring-1 ring-[#FFFCED]"
                  />
                ))}
              </div>
              <div className="text-xs">
                <p className="font-bold text-[#20251F] text-[11px]">
                  {project.members.length}{" "}
                  {project.members.length === 1 ? "Member" : "Members"}
                </p>
                <p className="text-[#596057] text-[10px]">Manage team &rarr;</p>
              </div>
            </div>
          </div>
        </div>

        <TaskBoard
          projectId={projectId}
          tasks={tasks}
          members={project.members}
          onTasksUpdated={fetchProjectAndTasks}
        />
      </div>

      <MembersModal
        isOpen={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
        projectId={projectId}
        members={project.members}
        isOwner={!!isOwner}
        onMembersUpdated={fetchProjectAndTasks}
      />

      <EditProjectModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        project={project}
        onSuccess={() => fetchProjectAndTasks()}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project Workspace"
        message={`Are you sure you want to permanently delete "${project.name}"? All tasks, discussions, and membership records will be destroyed.`}
        confirmText="Delete Workspace"
        variant="danger"
        isLoading={deleting}
      />
    </div>
  );
}
