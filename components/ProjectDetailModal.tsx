"use client"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"
import SkewContainer from "@/components/ui/SkewContainer"
import type { Project } from "@/types"
import { ArrowUpRight, X } from "lucide-react"

interface ProjectDetailModalProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProjectDetailModal({ project, open, onOpenChange }: ProjectDetailModalProps) {
  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[#141414] border border-[#333] rounded-none max-w-2xl max-h-[90vh] overflow-y-auto p-0 -skew-x-12"
        showCloseButton={false}
      >
        {/* Screenshot */}
        {project.screenshotUrl && (
          <div className="w-full h-56 bg-black overflow-hidden relative">
            <img
              src={project.screenshotUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Close button */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold uppercase text-white leading-tight">
                {project.title}
              </h2>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-[#666] hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tech stack */}
          {project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <SkewContainer key={tech} variant="ghost" className="px-2 py-1 skew-x-0">
                  <span className="text-xs font-mono text-[#B0B0B0]">{tech}</span>
                </SkewContainer>
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-[#333]" />

          {/* Description */}
          <MarkdownRenderer content={project.description} />

          {/* Visit site button */}
          {project.liveUrl && (
            <div className="pt-2">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                <SkewContainer variant="primary" className="px-6 py-3 skew-x-0" hoverEffect>
                  <span className="flex items-center gap-2 font-bold text-sm tracking-widest">
                    VISIT_SITE <ArrowUpRight size={16} />
                  </span>
                </SkewContainer>
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
