"use client"

import type React from "react"
import type { Project } from "@/types"
import SkewContainer from "./ui/SkewContainer"
import { Trash2, ExternalLink, Pencil } from "lucide-react"

interface ProjectListProps {
  projects: Project[]
  onDelete?: (id: string) => void
  onEdit?: (project: Project) => void
  loading?: boolean
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onDelete, onEdit, loading }) => {
  if (loading) {
    return <p className="font-mono text-[#B0B0B0] animate-pulse">LOADING_PROJECTS...</p>
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-mono text-[#B0B0B0]">NO_PROJECTS_DEPLOYED</p>
        <p className="text-sm text-[#666] mt-2">Add your first project above to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <SkewContainer key={project._id} variant="ghost" className="p-4">
          <div className="flex items-center gap-4">
            {/* Thumbnail */}
            {project.screenshotUrl && (
              <div className="w-20 h-14 shrink-0 bg-black border border-[#333] overflow-hidden hidden sm:block">
                <img
                  src={project.screenshotUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="font-display font-bold text-lg mb-1">{project.title}</h4>
              {project.description && (
                <p className="text-xs text-[#B0B0B0] mb-1 line-clamp-1">{project.description}</p>
              )}
              <div className="flex gap-3 items-center text-sm">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[#FF5F1F] hover:underline flex items-center gap-1 text-xs truncate"
                >
                  {project.liveUrl}
                  <ExternalLink size={12} />
                </a>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="text-xs font-mono bg-[#0a0a0a] border border-[#333] px-2 py-0.5">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              {onEdit && (
                <button
                  onClick={() => onEdit(project)}
                  className="p-2 hover:bg-[#FF5F1F]/20 hover:text-[#FF5F1F] transition-colors rounded"
                  title="Edit"
                >
                  <Pencil size={18} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(project._id)}
                  className="p-2 hover:bg-red-900/20 hover:text-red-500 transition-colors rounded"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>
        </SkewContainer>
      ))}
    </div>
  )
}

export default ProjectList
