"use client";

import React from "react";
import Link from "next/link";
import { ProjectSummary } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { FolderKanban, Calendar } from "lucide-react";

interface ProjectCardProps {
  project: ProjectSummary;
  onEdit?: (project: ProjectSummary) => void;
  onDelete?: (project: ProjectSummary) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const isOwner = project.role === "OWNER";
  const defaultColor = project.color || "#344E41";

  return (
    <Card hoverable className="flex flex-col justify-between h-full group relative overflow-hidden bg-[#FFFCED] border-[#D8D8C8] hover:border-[#A3B18A]">
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: defaultColor }}
      />

      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded flex items-center justify-center shrink-0 text-[#20251F]"
              style={{ backgroundColor: `${defaultColor}20`, border: `1px solid ${defaultColor}55` }}
            >
              <FolderKanban className="w-4 h-4" style={{ color: defaultColor }} />
            </div>
            <Link
              href={`/projects/${project.id}`}
              className="font-bold text-base text-[#20251F] hover:text-[#588157] transition-colors truncate block tracking-tight"
            >
              {project.name}
            </Link>
          </div>

          <div className="shrink-0">
            <Badge
              variant={isOwner ? "green" : "slate"}
              size="sm"
            >
              {isOwner ? "OWNER" : "MEMBER"}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-[#4D544B] line-clamp-2 min-h-[2.5rem] mb-3 leading-relaxed">
          {project.description || (
            <span className="text-[#596057] italic">No description provided</span>
          )}
        </p>
      </div>

      <div className="pt-3 border-t border-[#D8D8C8] flex items-center justify-between text-xs text-[#596057]">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#596057]" />
          <span>{formatDate(project.createdAt)}</span>
        </div>

        <Link
          href={`/projects/${project.id}`}
          className="font-bold text-xs sm:text-sm text-[#344E41] hover:text-[#588157] transition-colors flex items-center gap-1 group-hover:translate-x-0.5 transform duration-150 tracking-wider uppercase"
        >
          View Board &rarr;
        </Link>
      </div>
    </Card>
  );
}
