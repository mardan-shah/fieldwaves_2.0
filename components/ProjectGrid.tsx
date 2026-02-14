"use client"

import { useState } from "react"
import SkewContainer from "@/components/ui/SkewContainer"
import ProjectDetailModal from "@/components/ProjectDetailModal"
import type { Project } from "@/types"
import { ArrowUpRight } from "lucide-react"

interface ProjectGridProps {
  projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <SkewContainer
            key={project._id}
            variant="ghost"
            className="h-full group cursor-pointer"
            hoverEffect
            onClick={() => setSelectedProject(project)}
          >
            <div className="flex flex-col h-full -skew-x-12">
              {/* Image Area */}
              <div className="h-48 w-full bg-black relative overflow-hidden border-b-2 border-[#333] group-hover:border-[#FF5F1F] transition-colors">
                <img
                  src={project.screenshotUrl || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-125 group-hover:scale-110 skew-x-12"
                />
                <div className="absolute top-2 right-2 skew-x-12">
                  <SkewContainer variant="primary" className="p-1 px-2">
                    <ArrowUpRight size={16} />
                  </SkewContainer>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col grow bg-[#1a1a1a]">
                <div className=" h-full flex flex-col">
                  <h3 className="font-display text-xl font-bold mb-2">{project.title}</h3>
                  {project.description && (
                    <p className="text-sm text-[#B0B0B0] mb-4 grow line-clamp-2">{project.description}</p>
                  )}
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="text-xs font-mono text-[#B0B0B0] border border-[#333] px-2 py-1">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </SkewContainer>
        ))}
      </div>

      <ProjectDetailModal
        project={selectedProject}
        open={!!selectedProject}
        onOpenChange={(open) => { if (!open) setSelectedProject(null) }}
      />
    </>
  )
}
