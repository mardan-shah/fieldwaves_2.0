"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"
import Container from "@/components/ui/Container"
import type { iTeamMember } from "@/types"
import { Github, Linkedin, Twitter, Globe, Mail, X, Crown } from "lucide-react"

interface TeamDetailModalProps {
  member: iTeamMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TeamDetailModal({ member, open, onOpenChange }: TeamDetailModalProps) {
  if (!member) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-transparent border-none shadow-none max-w-2xl p-0 overflow-visible"
        showCloseButton={false}
      >
        <VisuallyHidden.Root>
          <DialogTitle>{member.name}</DialogTitle>
        </VisuallyHidden.Root>
        <div className="bg-card border border-border -skew-x-12 max-h-[90vh] overflow-y-auto p-8">
        {/* Avatar */}
        {member.avatarUrl && (
          <div
            className="w-full h-64 overflow-hidden relative"
            style={{ backgroundColor: member.backgroundColor || "#000" }}
          >
            <img
              src={member.avatarUrl}
              alt={member.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent " />
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-display text-3xl font-bold uppercase text-white leading-tight">
                  {member.name}
                </h2>
                {member.isOwner && (
                  <Container variant="primary" className="px-2 py-1">
                    <Crown size={14} />
                  </Container>
                )}
              </div>
              <p className="font-mono text-primary text-sm tracking-widest mt-1">{member.role}</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-muted hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Bio */}
          <MarkdownRenderer content={member.bio} />

          {/* Social links */}
          {member.socialLinks && Object.values(member.socialLinks).some(Boolean) && (
            <>
              <div className="border-t border-border" />
              <div className="flex gap-3">
                {member.socialLinks.github && (
                  <a
                    href={member.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Container variant="ghost" className="p-2.5 group-hover:border-primary">
                      <Github size={18} className="text-secondary group-hover:text-primary transition-colors" />
                    </Container>
                  </a>
                )}
                {member.socialLinks.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Container variant="ghost" className="p-2.5 group-hover:border-primary">
                      <Linkedin size={18} className="text-secondary group-hover:text-primary transition-colors" />
                    </Container>
                  </a>
                )}
                {member.socialLinks.twitter && (
                  <a
                    href={member.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Container variant="ghost" className="p-2.5 group-hover:border-primary">
                      <Twitter size={18} className="text-secondary group-hover:text-primary transition-colors" />
                    </Container>
                  </a>
                )}
                {member.socialLinks.website && (
                  <a
                    href={member.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Container variant="ghost" className="p-2.5 group-hover:border-primary">
                      <Globe size={18} className="text-secondary group-hover:text-primary transition-colors" />
                    </Container>
                  </a>
                )}
                {member.socialLinks.email && (
                  <a
                    href={`mailto:${member.socialLinks.email}`}
                    className="group"
                  >
                    <Container variant="ghost" className="p-2.5 group-hover:border-primary">
                      <Mail size={18} className="text-secondary group-hover:text-primary transition-colors" />
                    </Container>
                  </a>
                )}
              </div>
            </>
          )}
        </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
