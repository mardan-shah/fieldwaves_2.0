"use client"

import { useState, useMemo } from "react"
import Container from "@/components/ui/Container"
import ProjectDetailModal from "@/components/ProjectDetailModal"
import SearchFilterBar from "@/components/SearchFilterBar"
import type { iProject } from "@/types"
import { ArrowUpRight } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

interface ProjectGridProps {
  projects: iProject[]
  showSearch?: boolean
}

export default function ProjectGrid({ projects, showSearch = false }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<iProject | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const { ref: gridRef, isInView } = useInView()

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    projects.forEach(p => p.techStack.forEach(t => tags.add(t)))
    return Array.from(tags).sort()
  }, [projects])

  const filtered = useMemo(() => {
    let result = projects
    
    if (selectedTag) {
      result = result.filter(p => p.techStack.includes(selectedTag))
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.techStack.some(t => t.toLowerCase().includes(q))
      )
    }
    
    return result
  }, [projects, searchQuery, selectedTag])

  return (
    <>
      {showSearch && (
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="SEARCH_PROJECTS // title, tech stack..."
          tags={allTags}
          activeTag={selectedTag}
          onTagChange={setSelectedTag}
          resultCount={filtered.length}
          totalCount={projects.length}
        />
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-mono text-muted text-sm">
            {searchQuery ? "NO_RESULTS_FOUND" : "NO_PROJECTS_YET"}
          </p>
        </div>
      ) : (
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project, i) => (
            <div key={project._id} className={isInView ? "animate-fade-in-up" : "opacity-0"} style={{ animationDelay: `${i * 0.05}s` }}>
            <Container
              variant="ghost"
              className="h-full group cursor-pointer"
              noSkewMobile
              hoverEffect
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex flex-col h-full">
                {/* Image Area */}
                <div className="h-[250px] w-full bg-black relative overflow-hidden border-b-2 border-border group-hover:border-primary transition-colors">
                  <img
                    src={project.screenshotUrl || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-200 scale-125 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2">
                    <Container variant="primary" className="p-1 px-2">
                      <ArrowUpRight size={16} />
                    </Container>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col grow bg-background">
                  <h3 className="font-display text-xl font-bold mb-2">{project.title}</h3>
                  {project.description && (
                    <p className="text-sm text-secondary mb-4 grow line-clamp-2">{project.description}</p>
                  )}
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="text-xs font-mono text-secondary border border-border px-2 py-1">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Container>
            </div>
          ))}
        </div>
      )}

      <ProjectDetailModal
        project={selectedProject}
        open={!!selectedProject}
        onOpenChange={(open) => { if (!open) setSelectedProject(null) }}
      />
    </>
  )
}
