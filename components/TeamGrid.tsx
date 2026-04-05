"use client"

import { useState } from "react"
import Image from "next/image"
import Container from "@/components/ui/Container"
import TeamDetailModal from "@/components/TeamDetailModal"
import type { iTeamMember } from "@/types"
import { Github, Linkedin, Twitter } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

interface TeamGridProps {
  team: iTeamMember[]
}

export default function TeamGrid({ team }: TeamGridProps) {
  const [selectedMember, setSelectedMember] = useState<iTeamMember | null>(null)
  const { ref: gridRef, isInView } = useInView()

  return (
    <>
      <div ref={gridRef} className="grid md:grid-cols-3 gap-12">
        {team.map((member, i) => (
          <div
            key={member._id}
            className={`relative group cursor-pointer ${isInView ? "animate-fade-in-up" : "opacity-0"}`}
            style={{ animationDelay: `${i * 0.05}s` }}
            onClick={() => setSelectedMember(member)}
          >
            <Container variant="glass" className="h-full p-0" noSkewMobile>
              <div className="relative h-full flex flex-col">
                <div className="aspect-square md:aspect-4/5 w-full bg-gray-800 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-200 relative max-h-[300px]">
                  <img
                    src={member.avatarUrl || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover object-top scale-125"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-6">
                      <p className="text-white font-mono text-xs tracking-widest bg-background/80 px-3 py-1 -skew-x-12">VIEW_PROFILE</p>
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

                <div className="p-6 border-t-2 border-border group-hover:border-primary bg-background grow">
                  <div className="">
                    <h3 className="font-display text-2xl font-bold uppercase">{member.name}</h3>
                    <p className="font-mono text-primary text-xs mb-4 tracking-widest">{member.role}</p>
                    <p className="text-sm text-secondary line-clamp-2">{member.bio}</p>
                  </div>
                </div>
              </div>
            </Container>
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
