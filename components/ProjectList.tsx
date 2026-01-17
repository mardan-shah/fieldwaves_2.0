"use client"

import type React from "react"
import type { Project } from "../../types"
import SkewContainer from "./ui/SkewContainer"
import { Trash2, ExternalLink } from "lucide-react"

interface ProjectListProps {
  projects: Project[]
  onDelete?: (id: string) => void
  loading?: boolean
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onDelete, loading }) => {
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
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h4 className="font-display font-bold text-lg mb-1">{project.title}</h4>
              <div className="flex gap-3 items-center text-sm">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[#FF5F1F] hover:underline flex items-center gap-1"
                >
                  {project.liveUrl}
                  <ExternalLink size={12} />
                </a>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {project.techStack.map((tech) => (
                  <span key={tech} className="text-xs font-mono bg-[#0a0a0a] border border-[#333] px-2 py-1">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={() => onDelete?.(project._id)}
              className="p-2 hover:bg-red-900/20 hover:text-red-500 transition-colors rounded"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </SkewContainer>
      ))}
    </div>
  )
}

export default ProjectList
