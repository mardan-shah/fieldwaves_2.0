"use client"

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import MarkdownRenderer from "@/components/ui/MarkdownRenderer"
import SkewContainer from "@/components/ui/SkewContainer"
import type { TeamMember } from "@/types"
import { Github, Linkedin, Twitter, Globe, Mail, X, Crown } from "lucide-react"

interface TeamDetailModalProps {
  member: TeamMember | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TeamDetailModal({ member, open, onOpenChange }: TeamDetailModalProps) {
  if (!member) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-[#141414] border border-[#333] rounded-none max-w-2xl max-h-[90vh] overflow-y-auto p-0 -skew-x-12"
        showCloseButton={false}
      >
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
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
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
                  <SkewContainer variant="primary" className="px-2 py-1">
                    <Crown size={14} />
                  </SkewContainer>
                )}
              </div>
              <p className="font-mono text-[#FF5F1F] text-sm tracking-widest mt-1">{member.role}</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="text-[#666] hover:text-white transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-[#333]" />

          {/* Bio */}
          <MarkdownRenderer content={member.bio} />

          {/* Social links */}
          {member.socialLinks && Object.values(member.socialLinks).some(Boolean) && (
            <>
              <div className="border-t border-[#333]" />
              <div className="flex gap-3">
                {member.socialLinks.github && (
                  <a
                    href={member.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <SkewContainer variant="ghost" className="p-2.5 group-hover:border-[#FF5F1F]">
                      <Github size={18} className="text-[#B0B0B0] group-hover:text-[#FF5F1F] transition-colors" />
                    </SkewContainer>
                  </a>
                )}
                {member.socialLinks.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <SkewContainer variant="ghost" className="p-2.5 group-hover:border-[#FF5F1F]">
                      <Linkedin size={18} className="text-[#B0B0B0] group-hover:text-[#FF5F1F] transition-colors" />
                    </SkewContainer>
                  </a>
                )}
                {member.socialLinks.twitter && (
                  <a
                    href={member.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <SkewContainer variant="ghost" className="p-2.5 group-hover:border-[#FF5F1F]">
                      <Twitter size={18} className="text-[#B0B0B0] group-hover:text-[#FF5F1F] transition-colors" />
                    </SkewContainer>
                  </a>
                )}
                {member.socialLinks.website && (
                  <a
                    href={member.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <SkewContainer variant="ghost" className="p-2.5 group-hover:border-[#FF5F1F]">
                      <Globe size={18} className="text-[#B0B0B0] group-hover:text-[#FF5F1F] transition-colors" />
                    </SkewContainer>
                  </a>
                )}
                {member.socialLinks.email && (
                  <a
                    href={`mailto:${member.socialLinks.email}`}
                    className="group"
                  >
                    <SkewContainer variant="ghost" className="p-2.5 group-hover:border-[#FF5F1F] skew-x-0">
                      <Mail size={18} className="text-[#B0B0B0] group-hover:text-[#FF5F1F] transition-colors" />
                    </SkewContainer>
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
