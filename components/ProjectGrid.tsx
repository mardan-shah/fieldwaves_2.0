"use client"

import { useState, useMemo, useEffect } from "react"
import Container from "@/components/ui/Container"
import ProjectDetailModal from "@/components/ProjectDetailModal"
import SearchFilterBar from "@/components/SearchFilterBar"
import type { iProject } from "@/types"
import { ArrowUpRight } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"
import {cn } from "@/lib/utils"
import S3Image from "./ui/S3Image"

interface ProjectGridProps {
  projects: iProject[]
  showSearch?: boolean
}

function ImageCarousel({ screenshots, mainImage, alt }: { screenshots: string[], mainImage: string, alt: string }) {
  const [index, setIndex] = useState(0)
  const [hovered, setHovered] = useState(false)
  const allImages = screenshots?.length > 0 ? screenshots : [mainImage || "/placeholder.svg"]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (hovered && allImages.length > 1) {
      interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % allImages.length)
      }, 1500)
    } else {
      setIndex(0)
    }
    return () => clearInterval(interval)
  }, [hovered, allImages.length])

  return (
    <div 
      className="h-[250px] w-full bg-black relative overflow-hidden border-b-2 border-border group-hover:border-primary transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {allImages.map((src, i) => (
        <S3Image
          key={src + i}
          src={src}
          alt={alt}
          showLoadingSpinner={false}
          className={cn(
            "absolute inset-0 grayscale group-hover:grayscale-0",
            i === index ? "opacity-100" : "opacity-0"
          )}
        />
      ))}
      
      {allImages.length > 1 && hovered && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
          {allImages.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 transition-all duration-300 ${i === index ? "w-4 bg-primary" : "w-1.5 bg-white/40"}`} 
            />
          ))}
        </div>
      )}

      <div className="absolute top-2 right-2 z-10">
        <Container variant="primary" className="p-1 px-2">
          <ArrowUpRight size={16} />
        </Container>
      </div>
    </div>
  )
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
                <ImageCarousel 
                  screenshots={project.screenshots || []} 
                  mainImage={project.screenshotUrl} 
                  alt={project.title} 
                />

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
