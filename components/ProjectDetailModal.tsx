"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"
import Container from "@/components/ui/Container"
import type { iProject } from "@/types"
import { ArrowUpRight, Github, X, ChevronLeft, ChevronRight } from "lucide-react"

import S3Image from "./ui/S3Image"

interface ProjectDetailModalProps {
  project: iProject | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProjectDetailModal({ project, open, onOpenChange }: ProjectDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  if (!project) return null

  const allImages = project.screenshots?.length ? project.screenshots : (project.screenshotUrl ? [project.screenshotUrl] : [])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) setCurrentImageIndex(0)
      onOpenChange(val)
    }}>
      <DialogContent
        className="bg-transparent border-none shadow-none max-w-4xl! p-0 overflow-visible"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        <VisuallyHidden.Root>
          <DialogTitle>{project.title}</DialogTitle>
        </VisuallyHidden.Root>
        <div className="bg-card border border-border  max-h-[90vh] overflow-y-auto p-8">
          {/* Screenshot Carousel */}
          {allImages.length > 0 && (
            <div className="w-full aspect-[21/9] bg-black overflow-hidden relative group/carousel">
              <S3Image
                src={allImages[currentImageIndex]}
                alt={project.title}
                objectFit="contain"
                className="w-full h-full transition-opacity duration-300"
              />
              
              {allImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 text-white hover:text-primary opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 p-2 text-white hover:text-primary opacity-0 group-hover/carousel:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={20} />
                  </button>
                  
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                    {allImages.map((_, i) => (
                      <button 
                        key={i}
                        onClick={() => setCurrentImageIndex(i)}
                        className={`h-1.5 transition-all duration-300 ${i === currentImageIndex ? "w-6 bg-primary" : "w-2 bg-white/40"}`}
                      />
                    ))}
                  </div>
                </>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
            </div>
          )}

          <div className="space-y-5 pt-2">
            {/* Close button */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-3xl font-bold uppercase text-white leading-tight">
                  {project.title}
                </h2>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="text-muted hover:text-white transition-colors p-1 cursor-pointer border-0 focus:outline-none focus:ring-0 "
              >
                <X size={20} />
              </button>
            </div>

            {/* Tech stack */}
            {project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Container key={tech} variant="ghost" className="px-2 py-1 skew-x-0">
                    <span className="text-xs font-mono text-secondary">{tech}</span>
                  </Container>
                ))}
              </div>
            )}

            {/* Visit site button */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Container variant="primary" className="px-6 py-3 skew-x-0" hoverEffect >
                    <span className="flex items-center gap-2 font-bold text-sm tracking-widest">
                      VISIT_SITE <ArrowUpRight size={16} />
                    </span>
                  </Container>
                </a>
              )}
              
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 border border-border hover:border-primary text-secondary hover:text-primary transition-all font-bold text-sm tracking-widest group"
                >
                  <Github size={18} className="group-hover:scale-110 transition-transform" /> VIEW_SOURCE
                </a>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Description */}
            <div className="">
              <MarkdownRenderer content={project.description} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
