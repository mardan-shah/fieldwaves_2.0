"use client"

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
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
        className="bg-transparent border-none shadow-none max-w-4xl! p-0 overflow-visible"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        <VisuallyHidden.Root>
          <DialogTitle>{member.name}</DialogTitle>
        </VisuallyHidden.Root>
        <div className="bg-card border border-border max-h-[90vh] overflow-y-auto p-8">
        {/* Avatar */}
        {member.avatarUrl && (
          <div
            className="w-full h-80 md:h-[400px] overflow-hidden relative"
            style={{ backgroundColor: member.backgroundColor || "#000" }}
          >
            {/* Blurred background layer to fill empty space seamlessly */}
            <div className="absolute inset-0 opacity-30 blur-2xl transform scale-110">
              <Image
                src={member.avatarUrl}
                alt={`${member.name} background`}
                fill
                className="object-cover object-top"
              />
            </div>
            
            {/* Main image uncropped */}
            <Image
              src={member.avatarUrl}
              alt={member.name}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="object-contain object-bottom relative z-10 drop-shadow-2xl"
            />
            
            {/* Bottom fade overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent z-20 pointer-events-none" />
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
