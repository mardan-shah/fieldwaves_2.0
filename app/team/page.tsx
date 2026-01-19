"use client"

import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import SectionHeading from "../../components/ui/SectionHeading"
import Button from "../../components/ui/Button"
import SkewContainer from "../../components/ui/SkewContainer"
import { getTeam } from "../actions/public"
import type { TeamMember } from "../../types"
import { Github, Linkedin, Twitter, Globe, Mail } from "lucide-react"

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await getTeam()
        // @ts-ignore
        setTeam(data)
      } catch (error) {
        console.error("Failed to fetch team", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "github":
        return Github
      case "linkedin":
        return Linkedin
      case "twitter":
        return Twitter
      case "website":
        return Globe
      case "email":
        return Mail
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden selection:bg-[#FF5F1F] selection:text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center pt-32 pb-20">
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#B0B0B0 1px, transparent 1px), linear-gradient(90deg, #B0B0B0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-14 md:px-6 w-full">
          <SectionHeading
            label="Our Team"
            title="OPERATIVES"
            subtitle="Senior engineers dedicated to engineering excellence"
          />
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-14 md:px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {loading ? (
              <p>Loading...</p>
            ) : (
              team.map((member) => (
                <div key={member._id} className="relative group">
                  <SkewContainer variant="glass" className="h-full p-0">
                    <div className="relative h-full flex flex-col -skew-x-12">
                      <div className="aspect-square md:aspect-4/5 w-full bg-gray-800 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 relative">
                        <img
                          src={member.avatarUrl || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover skew-x-12 scale-125"
                        />

                        {/* Hover Overlay - Social Links */}
                        <div className="absolute inset-0 bg-[#FF5F1F]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6">
                          <div className="flex flex-col items-center gap-6 skew-x-12">
                            <div className="flex gap-6">
                              {member.socialLinks?.github && (
                                <a
                                  href={member.socialLinks.github}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-white hover:scale-125 transition-transform"
                                  title="GitHub"
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
                                  title="LinkedIn"
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
                                  title="Twitter"
                                >
                                  <Twitter size={32} />
                                </a>
                              )}
                            </div>
                            {member.socialLinks?.email && (
                              <a
                                href={`mailto:${member.socialLinks.email}`}
                                className="text-white hover:underline text-sm font-mono"
                              >
                                {member.socialLinks.email}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 border-t-2 border-[#333] group-hover:border-[#FF5F1F] bg-[#1a1a1a] grow">
                        <div className="skew-x-12">
                          <h3 className="font-display text-2xl font-bold uppercase">{member.name}</h3>
                          <p className="font-mono text-[#FF5F1F] text-xs mb-4 tracking-widest">{member.role}</p>
                          <p className="text-sm text-[#B0B0B0]">{member.bio}</p>
                        </div>
                      </div>
                    </div>
                  </SkewContainer>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-14 md:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase">Join Our Team</h2>
          <p className="text-lg text-[#B0B0B0] mb-8 max-w-2xl mx-auto">
            We're always looking for talented engineers who share our values.
          </p>
          <Button href="/contact">GET IN TOUCH</Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
