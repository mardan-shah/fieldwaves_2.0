"use client"

import type React from "react"
import type { iProject } from "@/types"
import Container from "./ui/Container"
import { Trash2, ExternalLink, Pencil, ChevronUp, ChevronDown, Star } from "lucide-react"

interface ProjectListProps {
  projects: iProject[]
  onDelete?: (id: string) => void
  onEdit?: (project: iProject) => void
  onReorder?: (id: string, direction: "up" | "down") => void
  onToggleFeatured?: (id: string) => void
  loading?: boolean
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onDelete, onEdit, onReorder, onToggleFeatured, loading }) => {
  if (loading) {
    return <p className="font-mono text-secondary animate-pulse">LOADING_PROJECTS...</p>
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-mono text-secondary">NO_PROJECTS_DEPLOYED</p>
        <p className="text-sm text-muted mt-2">Add your first project above to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {projects.map((project, i) => (
        <Container key={project._id} variant="ghost" className="p-4">
          <div className="flex items-center gap-4">
            {/* Reorder */}
            {onReorder && (
              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  onClick={() => onReorder(project._id, "up")}
                  disabled={i === 0}
                  className="p-0.5 text-muted hover:text-white disabled:opacity-20 transition-colors"
                  title="Move up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => onReorder(project._id, "down")}
                  disabled={i === projects.length - 1}
                  className="p-0.5 text-muted hover:text-white disabled:opacity-20 transition-colors"
                  title="Move down"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            )}

            {/* Thumbnail */}
            {project.screenshotUrl && (
              <div className="w-20 h-14 shrink-0 bg-black border border-border overflow-hidden hidden sm:block">
                <img
                  src={project.screenshotUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-display font-bold text-lg">{project.title}</h4>
                {project.featured && (
                  <span className="text-[10px] font-mono font-bold tracking-widest bg-primary/20 text-primary px-2 py-0.5">
                    FEATURED
                  </span>
                )}
              </div>
              {project.description && (
                <p className="text-xs text-secondary mb-1 line-clamp-1">{project.description}</p>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 items-center text-sm">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-primary hover:underline flex items-center gap-1 text-xs truncate"
                >
                  {project.liveUrl}
                  <ExternalLink size={12} />
                </a>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-secondary hover:underline flex items-center gap-1 text-xs truncate"
                  >
                    GITHUB_REPO
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="text-xs font-mono bg-input border border-border px-2 py-0.5">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-1 shrink-0">
              {onToggleFeatured && (
                <button
                  onClick={() => onToggleFeatured(project._id)}
                  className={`p-2 transition-colors ${
                    project.featured
                      ? "text-primary hover:text-white"
                      : "text-muted hover:text-primary"
                  }`}
                  title={project.featured ? "Remove featured" : "Mark featured"}
                >
                  <Star size={16} fill={project.featured ? "currentColor" : "none"} />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(project)}
                  className="p-2 hover:bg-primary/20 hover:text-primary transition-colors"
                  title="Edit"
                >
                  <Pencil size={16} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(project._id)}
                  className="p-2 hover:bg-red-900/20 hover:text-red-500 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        </Container>
      ))}
    </div>
  )
}

export default ProjectList
