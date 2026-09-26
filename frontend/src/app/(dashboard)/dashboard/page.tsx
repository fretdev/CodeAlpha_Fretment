"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { api } from "@/lib/api";
import { ProjectSummary, Task } from "@/lib/types";
import { Header } from "@/components/layout/Header";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { StatusBadge } from "@/components/tasks/StatusBadge";
import { NotificationItem } from "@/components/notifications/NotificationItem";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDate } from "@/lib/utils";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  ArrowRight,
  Bell,
  Calendar,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { notifications, markAsRead, markAsUnread, lastEventTimestamp } =
    useNotifications();

  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [allTasks, setAllTasks] = useState<{ task: Task; projectName: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const loadDashboardData = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const userProjects = await api.projects.list();
      setProjects(userProjects);

      const taskPromises = userProjects.map(async (p) => {
        try {
          const tasks = await api.tasks.list(p.id);
          return tasks.map((t) => ({ task: t, projectName: p.name }));
        } catch {
          return [];
        }
      });

      const taskResults = await Promise.all(taskPromises);
      setAllTasks(taskResults.flat());
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (lastEventTimestamp) {
      loadDashboardData(true);
    }
  }, [lastEventTimestamp]);

  const totalProjects = projects.length;
  const totalTasks = allTasks.length;
  const inProgressTasks = allTasks.filter(
    (item) => item.task.status === "IN_PROGRESS"
  ).length;
  const completedTasks = allTasks.filter(
    (item) => item.task.status === "DONE"
  ).length;
  const overdueTasks = allTasks.filter(
    (item) =>
      item.task.dueDate &&
      item.task.status !== "DONE" &&
      new Date(item.task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0)
  ).length;

  const upcomingTasks = allTasks
    .filter((item) => item.task.status !== "DONE")
    .sort((a, b) => {
      if (!a.task.dueDate) return 1;
      if (!b.task.dueDate) return -1;
      return (
        new Date(a.task.dueDate).getTime() - new Date(b.task.dueDate).getTime()
      );
    })
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <Header
        title={`Welcome, ${user?.username || "Developer"}`}
        subtitle="Active projects, prioritized milestones, and live team stream."
        action={
          <Button
            size="sm"
            onClick={() => setIsCreateProjectOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Project
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {loading ? (
          <div className="py-24 text-center">
            <Spinner size="lg" label="Loading dashboard metrics..." />
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={<FolderKanban className="w-7 h-7 text-[#344E41]" />}
            title="Workspace Ready"
            description="You don't have any projects in your workspace yet. Create your first project to organize tasks and invite team members."
            action={
              <Button
                onClick={() => setIsCreateProjectOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Create First Project
              </Button>
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <Card className="p-4 bg-[#FFFCED] border-[#D8D8C8] hover:border-[#A3B18A] transition-all group shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6B7369] uppercase tracking-widest">
                    Projects
                  </span>
                  <div className="p-1.5 bg-[#FFF8D6] text-[#344E41] rounded border border-[#D8D8C8] group-hover:border-[#588157] transition-colors">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[#20251F]">
                    {totalProjects}
                  </span>
                  <span className="text-xs text-[#596057]">active</span>
                </div>
              </Card>

              <Card className="p-4 bg-[#FFFCED] border-[#D8D8C8] hover:border-[#A3B18A] transition-all group shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6B7369] uppercase tracking-widest">
                    In Progress
                  </span>
                  <div className="p-1.5 bg-[#FFF8D6] text-[#C57B28] rounded border border-[#D8D8C8] group-hover:border-[#C57B28] transition-colors">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[#C57B28]">
                    {inProgressTasks}
                  </span>
                  <span className="text-xs text-[#596057]">tasks</span>
                </div>
              </Card>

              <Card className="p-4 bg-[#FFFCED] border-[#D8D8C8] hover:border-[#A3B18A] transition-all group shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6B7369] uppercase tracking-widest">
                    Completed
                  </span>
                  <div className="p-1.5 bg-[#FFF8D6] text-[#588157] rounded border border-[#D8D8C8] group-hover:border-[#588157] transition-colors">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[#588157]">
                    {completedTasks}
                  </span>
                  <span className="text-xs text-[#596057]">of {totalTasks}</span>
                </div>
              </Card>

              <Card className="p-4 bg-[#FFFCED] border-[#D8D8C8] hover:border-[#A3B18A] transition-all group shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#6B7369] uppercase tracking-widest">
                    Overdue
                  </span>
                  <div className="p-1.5 bg-[#FFF8D6] text-[#BC4749] rounded border border-[#D8D8C8] group-hover:border-[#BC4749] transition-colors">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-[#BC4749]">
                    {overdueTasks}
                  </span>
                  <span className="text-xs text-[#596057]">action required</span>
                </div>
              </Card>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs sm:text-sm font-bold text-[#20251F] uppercase tracking-wider">
                    Workspaces ({projects.length})
                  </h2>
                </div>
                <Link
                  href="/projects"
                  className="text-xs sm:text-sm font-bold text-[#344E41] hover:text-[#588157] flex items-center gap-1 transition-colors uppercase tracking-wider"
                >
                  View all &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.slice(0, 6).map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-bold text-[#20251F] uppercase tracking-wider">
                    Pending Tasks Queue
                  </h2>
                </div>

                <div className="bg-[#FFFCED] rounded-lg border border-[#D8D8C8] divide-y divide-[#D8D8C8] overflow-hidden shadow-xs">
                  {upcomingTasks.length === 0 ? (
                    <div className="p-8 text-center text-sm text-[#596057]">
                      Queue is clear. No pending tasks scheduled.
                    </div>
                  ) : (
                    upcomingTasks.map(({ task, projectName }) => (
                      <Link
                        key={task.id}
                        href={`/projects/${task.projectId}`}
                        className="flex items-center justify-between p-3.5 hover:bg-[#FFF8D6] transition-colors group gap-3"
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-[#344E41] bg-[#E8EDE1] border border-[#D8D8C8] px-2.5 py-0.5 rounded shrink-0 whitespace-nowrap max-w-[200px] truncate">
                              {projectName}
                            </span>
                            <PriorityBadge
                              priority={task.priority}
                              size="sm"
                            />
                            <StatusBadge status={task.status} size="sm" />
                          </div>
                          <h4 className="text-sm font-semibold text-[#20251F] group-hover:text-[#588157] transition-colors truncate">
                            {task.title}
                          </h4>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 text-xs text-[#596057]">
                          {task.dueDate && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#596057]" />
                              <span className="text-xs text-[#4D544B] whitespace-nowrap">
                                {formatDate(task.dueDate)}
                              </span>
                            </div>
                          )}
                          <ArrowRight className="w-4 h-4 text-[#6B7369] group-hover:translate-x-1 group-hover:text-[#20251F] transition-all" />
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs sm:text-sm font-bold text-[#20251F] uppercase tracking-wider">
                    Activity Stream
                  </h2>
                  <Link
                    href="/notifications"
                    className="text-xs font-bold text-[#344E41] hover:text-[#588157] uppercase tracking-wider"
                  >
                    View all
                  </Link>
                </div>

                <div className="bg-[#FFFCED] rounded-lg border border-[#D8D8C8] p-2 space-y-1.5 max-h-[380px] overflow-y-auto shadow-xs">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center">
                      <Bell className="w-5 h-5 text-[#6B7369] mx-auto mb-1.5" />
                      <p className="text-xs text-[#596057]">
                        No activity recorded yet.
                      </p>
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <NotificationItem
                        key={n.id}
                        notification={n}
                        onMarkRead={markAsRead}
                        onMarkUnread={markAsUnread}
                        compact
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onSuccess={() => loadDashboardData()}
      />
    </div>
  );
}
