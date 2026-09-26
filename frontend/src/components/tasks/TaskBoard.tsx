"use client";

import React, { useState, useMemo } from "react";
import { ProjectMemberItem, Task, TaskPriority, TaskStatus } from "@/lib/types";
import { TaskCard } from "./TaskCard";
import { CreateTaskModal } from "./CreateTaskModal";
import { EditTaskModal } from "./EditTaskModal";
import { TaskDetailModal } from "./TaskDetailModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Search, Circle, Clock, CheckCircle2 } from "lucide-react";

interface TaskBoardProps {
  projectId: number;
  tasks: Task[];
  members: ProjectMemberItem[];
  onTasksUpdated: () => void;
}

export function TaskBoard({
  projectId,
  tasks,
  members,
  onTasksUpdated,
}: TaskBoardProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createDefaultStatus, setCreateDefaultStatus] =
    useState<TaskStatus>("TODO");
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPriority =
        priorityFilter === "ALL" || task.priority === priorityFilter;

      const matchesAssignee =
        assigneeFilter === "ALL" ||
        (assigneeFilter === "UNASSIGNED"
          ? !task.assignee
          : task.assignee?.id === Number(assigneeFilter));

      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchQuery, priorityFilter, assigneeFilter]);

  const todoTasks = filteredTasks.filter((t) => t.status === "TODO");
  const inProgressTasks = filteredTasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = filteredTasks.filter((t) => t.status === "DONE");

  const openCreateModal = (status: TaskStatus) => {
    setCreateDefaultStatus(status);
    setIsCreateOpen(true);
  };

  const handleStatusChange = async (task: Task, newStatus: TaskStatus) => {
    try {
      const { api } = await import("@/lib/api");
      await api.tasks.update(projectId, task.id, {
        status: newStatus,
      });
      onTasksUpdated();
    } catch (err: any) {
      alert(err.message || "Failed to move task");
    }
  };

  const columns: {
    status: TaskStatus;
    title: string;
    tasks: Task[];
    icon: React.ReactNode;
    countBadgeColor: string;
  }[] = [
    {
      status: "TODO",
      title: "TO DO",
      tasks: todoTasks,
      icon: <Circle className="w-3.5 h-3.5 text-[#6B7369]" />,
      countBadgeColor: "bg-[#FFF8D6] text-[#4D544B] border-[#D8D8C8]",
    },
    {
      status: "IN_PROGRESS",
      title: "IN PROGRESS",
      tasks: inProgressTasks,
      icon: <Clock className="w-3.5 h-3.5 text-[#C57B28]" />,
      countBadgeColor: "bg-[#C57B28]/15 text-[#9E5D15] border-[#C57B28]/30",
    },
    {
      status: "DONE",
      title: "DONE",
      tasks: doneTasks,
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-[#588157]" />,
      countBadgeColor: "bg-[#588157]/15 text-[#344E41] border-[#588157]/30",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 p-4 bg-[#FFFCED] rounded-lg border border-[#D8D8C8] shadow-xs">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Filter tasks by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#6B7369] uppercase tracking-wider">
              Priority:
            </span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs sm:text-sm font-medium text-[#20251F] bg-[#FFF8D6] hover:bg-[#FFF3B0] border border-[#D8D8C8] rounded-md px-2.5 py-1.5 outline-none cursor-pointer"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#6B7369] uppercase tracking-wider">
              Assignee:
            </span>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="text-xs sm:text-sm font-medium text-[#20251F] bg-[#FFF8D6] hover:bg-[#FFF3B0] border border-[#D8D8C8] rounded-md px-2.5 py-1.5 outline-none cursor-pointer max-w-[150px] truncate"
            >
              <option value="ALL">All Assignees</option>
              <option value="UNASSIGNED">Unassigned</option>
              {members.map((m) => (
                <option key={m.user.id} value={m.user.id}>
                  {m.user.username}
                </option>
              ))}
            </select>
          </div>

          <Button
            size="sm"
            onClick={() => openCreateModal("TODO")}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Task
          </Button>
        </div>
      </div>

      <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-5 items-start overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0">
        {columns.map((col) => (
          <div
            key={col.status}
            className="w-[85vw] sm:w-[320px] md:w-auto shrink-0 md:shrink bg-[#FFF8D6] p-4 rounded-lg border border-[#D8D8C8] flex flex-col min-h-[480px] snap-center shadow-xs"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D8D8C8]">
              <div className="flex items-center gap-2">
                {col.icon}
                <h3 className="font-bold text-xs sm:text-sm text-[#20251F] tracking-wider">
                  {col.title}
                </h3>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded border ${col.countBadgeColor}`}
                >
                  {col.tasks.length}
                </span>
              </div>

              <button
                onClick={() => openCreateModal(col.status)}
                className="p-1 text-[#6B7369] hover:text-[#20251F] hover:bg-[#FFFCED] rounded transition-colors cursor-pointer"
                title={`Add task to ${col.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {col.tasks.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center border border-dashed border-[#D8D8C8] rounded-md p-4 text-center bg-[#FFFCED]/50">
                  <p className="text-xs sm:text-sm text-[#596057] font-medium">
                    No tasks in {col.title}
                  </p>
                  <button
                    onClick={() => openCreateModal(col.status)}
                    className="mt-1.5 text-xs sm:text-sm font-semibold text-[#344E41] hover:text-[#588157] cursor-pointer"
                  >
                    + Create task
                  </button>
                </div>
              ) : (
                col.tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => setSelectedTaskId(task.id)}
                    onStatusChange={(newStatus) =>
                      handleStatusChange(task, newStatus)
                    }
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        projectId={projectId}
        members={members}
        defaultStatus={createDefaultStatus}
        onSuccess={() => onTasksUpdated()}
      />

      <EditTaskModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        projectId={projectId}
        task={editingTask}
        members={members}
        onSuccess={() => {
          onTasksUpdated();
          setEditingTask(null);
        }}
      />

      <TaskDetailModal
        isOpen={selectedTaskId !== null}
        onClose={() => setSelectedTaskId(null)}
        projectId={projectId}
        taskId={selectedTaskId}
        members={members}
        onTaskUpdated={() => onTasksUpdated()}
        onTaskDeleted={() => {
          setSelectedTaskId(null);
          onTasksUpdated();
        }}
        onOpenEditModal={(task) => {
          setSelectedTaskId(null);
          setEditingTask(task);
        }}
      />
    </div>
  );
}
