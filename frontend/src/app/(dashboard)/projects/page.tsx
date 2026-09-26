"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { Spinner } from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import { ProjectSummary } from "@/lib/types";
import { FolderKanban, Plus, Search } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "OWNER" | "MEMBER">("ALL");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await api.projects.list();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description &&
          p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole =
        roleFilter === "ALL" || p.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [projects, searchQuery, roleFilter]);

  return (
    <div className="space-y-6">
      <Header
        title="PROJECT DIRECTORY"
        subtitle="Manage software workspaces, permissions, and repositories."
        action={
          <Button
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Project
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 p-3.5 bg-[#FFFCED] rounded-lg border border-[#D8D8C8] shadow-xs">
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-3.5 h-3.5" />}
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setRoleFilter("ALL")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                roleFilter === "ALL"
                  ? "bg-[#344E41] text-[#FFFCED] border border-[#344E41]"
                  : "text-[#596057] hover:bg-[#FFF8D6] hover:text-[#20251F]"
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setRoleFilter("OWNER")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                roleFilter === "OWNER"
                  ? "bg-[#344E41] text-[#FFFCED] border border-[#344E41]"
                  : "text-[#596057] hover:bg-[#FFF8D6] hover:text-[#20251F]"
              }`}
            >
              Owner ({projects.filter((p) => p.role === "OWNER").length})
            </button>
            <button
              onClick={() => setRoleFilter("MEMBER")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                roleFilter === "MEMBER"
                  ? "bg-[#344E41] text-[#FFFCED] border border-[#344E41]"
                  : "text-[#596057] hover:bg-[#FFF8D6] hover:text-[#20251F]"
              }`}
            >
              Member ({projects.filter((p) => p.role === "MEMBER").length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Spinner size="lg" label="Loading projects..." />
          </div>
        ) : filteredProjects.length === 0 ? (
          <EmptyState
            icon={<FolderKanban className="w-7 h-7 text-[#7D857B]" />}
            title={
              searchQuery || roleFilter !== "ALL"
                ? "No matching projects found"
                : "No projects in directory"
            }
            description={
              searchQuery || roleFilter !== "ALL"
                ? "Try refining your search keyword or selected role filter."
                : "Create your first project workspace to start collaborating on tasks."
            }
            action={
              !searchQuery && roleFilter === "ALL" ? (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Create Project
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchProjects()}
      />
    </div>
  );
}
