"use client"

import { useState } from "react"
import SkewContainer from "@/components/ui/SkewContainer"
import TeamDetailModal from "@/components/TeamDetailModal"
import type { TeamMember } from "@/types"
import { Github, Linkedin, Twitter } from "lucide-react"

interface TeamGridProps {
  team: TeamMember[]
}

export default function TeamGrid({ team }: TeamGridProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)

  return (
    <>
      <div className="grid md:grid-cols-3 gap-12">
        {team.map((member) => (
          <div
            key={member._id}
            className="relative group cursor-pointer"
            onClick={() => setSelectedMember(member)}
          >
            <SkewContainer variant="glass" className="h-full p-0">
              <div className="relative h-full flex flex-col -skew-x-12">
                <div className="aspect-square md:aspect-4/5 w-full bg-gray-800 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 relative max-h-[300px]">
                  <img
                    src={member.avatarUrl || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover skew-x-12 scale-125"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#FF5F1F]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6">
                    <div className="flex flex-col items-center gap-6 skew-x-12">
                      <p className="text-white font-mono text-xs tracking-widest">VIEW_PROFILE</p>
                      <div className="flex gap-6">
                        {member.socialLinks?.github && (
                          <a
                            href={member.socialLinks.github}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white hover:scale-125 transition-transform"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github size={32} />
                          </a>
                        )}
                        {member.socialLinks?.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white hover:scale-125 transition-transform"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Linkedin size={32} />
                          </a>
                        )}
                        {member.socialLinks?.twitter && (
                          <a
                            href={member.socialLinks.twitter}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white hover:scale-125 transition-transform"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Twitter size={32} />
                          </a>
                        )}
                      </div>
                      {member.socialLinks?.email && (
                        <a
                          href={`mailto:${member.socialLinks.email}`}
                          className="text-white hover:underline text-sm font-mono"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {member.socialLinks.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t-2 border-[#333] group-hover:border-[#FF5F1F] bg-[#1a1a1a] grow">
                  <div className="">
                    <h3 className="font-display text-2xl font-bold uppercase">{member.name}</h3>
                    <p className="font-mono text-[#FF5F1F] text-xs mb-4 tracking-widest">{member.role}</p>
                    <p className="text-sm text-[#B0B0B0] line-clamp-2">{member.bio}</p>
                  </div>
                </div>
              </div>
            </SkewContainer>
          </div>
        ))}
      </div>

      <TeamDetailModal
        member={selectedMember}
        open={!!selectedMember}
        onOpenChange={(open) => { if (!open) setSelectedMember(null) }}
      />
    </>
  )
}
