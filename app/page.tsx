"use client"

import { useEffect, useState } from "react"
import SkewContainer from "../components/ui/SkewContainer"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Button from "../components/ui/Button"
import StatCard from "../components/ui/StatCard"
import SectionHeading from "../components/ui/SectionHeading"
import ClientLogoGrid from "../components/ClientLogoGrid"
import { getProjects, getTeam } from "./actions/public"
import type { Project, TeamMember } from "../../types"
import { Github, Linkedin, Twitter, ArrowUpRight, Lightbulb } from "lucide-react"

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projData, teamData] = await Promise.all([getProjects(), getTeam()])
        // @ts-ignore
        setProjects(projData)
        // @ts-ignore
        setTeam(teamData)
      } catch (error) {
        console.error("Failed to fetch data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const clients = [
    { name: "Netflix", logo: "https://picsum.photos/seed/logo1/100/100" },
    { name: "Stripe", logo: "https://picsum.photos/seed/logo2/100/100" },
    { name: "Figma", logo: "https://picsum.photos/seed/logo3/100/100" },
    { name: "Notion", logo: "https://picsum.photos/seed/logo4/100/100" },
    { name: "Vercel", logo: "https://picsum.photos/seed/logo5/100/100" },
  ]

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden selection:bg-[#FF5F1F] selection:text-white pb-20">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Grid Lines */}
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#B0B0B0 1px, transparent 1px), linear-gradient(90deg, #B0B0B0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="flex flex-col items-start gap-4">
            <SkewContainer variant="secondary" className="px-3 py-1 mb-4">
              <span className="font-mono text-xs font-bold tracking-widest">SYS_ONLINE // V.2.5.0</span>
            </SkewContainer>

            <h1 className="font-display text-6xl md:text-8xl font-bold leading-[0.9] tracking-tighter uppercase mb-6 max-w-5xl">
              Engineering <br />
              <span className="text-transparent" style={{ WebkitTextStroke: "2px #FF5F1F" }}>
                Over Vibe
              </span>{" "}
              <br />
              Coding
            </h1>

            <div className="max-w-2xl bg-[#1a1a1a]/80 backdrop-blur-sm border-l-4 border-[#FF5F1F] pl-6 py-2">
              <p className="text-xl md:text-2xl text-[#B0B0B0] font-light">
                We use AI not to copy-paste, but to accelerate{" "}
                <span className="text-white font-bold">senior-level security</span> and{" "}
                <span className="text-white font-bold">O(n) performance</span>.
              </p>
            </div>

            <div className="mt-12 flex gap-6 flex-wrap">
              <Button href="/projects">EXPLORE WORK</Button>
              <Button variant="outline" href="/services">
                LEARN MORE
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard label="Projects Delivered" value="150+" description="Enterprise-scale solutions" />
            <StatCard label="Uptime" value="99.99%" description="Average reliability" />
            <StatCard label="Performance" value="89%" description="Average improvement" />
            <StatCard label="Team Members" value="25+" description="Senior engineers" />
          </div>
        </div>
      </section>

      {/* --- CLIENT LOGOS --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center font-mono text-xs text-[#B0B0B0] uppercase tracking-widest mb-12">
            Trusted by industry leaders
          </p>
          <ClientLogoGrid clients={clients} />
        </div>
      </section>

      {/* --- FEATURED PROJECTS PREVIEW --- */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading
            label="Recent Work"
            title="Featured Deployments"
            subtitle="A selection of our latest enterprise solutions"
            align="right"
            className="mb-16"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {loading ? (
              <p className="font-mono text-[#FF5F1F] animate-pulse">LOADING_DATA_STREAM...</p>
            ) : (
              projects.slice(0, 3).map((project) => (
                <SkewContainer key={project._id} variant="ghost" className="h-full group" hoverEffect>
                  <div className="flex flex-col h-full">
                    {/* Image Area */}
                    <div className="h-48 w-full bg-[#000] relative overflow-hidden border-b-2 border-[#333] group-hover:border-[#FF5F1F] transition-colors">
                      <img
                        src={project.screenshotUrl || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-110 group-hover:scale-100"
                      />
                      <div className="absolute top-2 right-2">
                        <SkewContainer variant="primary" className="p-1 px-2">
                          <ArrowUpRight size={16} />
                        </SkewContainer>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-grow bg-[#1a1a1a]">
                      <h3 className="font-display text-xl font-bold mb-2">{project.title}</h3>
                      <div className="mt-auto flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <span key={tech} className="text-xs font-mono text-[#B0B0B0] border border-[#333] px-1">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </SkewContainer>
              ))
            )}
          </div>

          <div className="text-center">
            <Button href="/projects">VIEW ALL PROJECTS</Button>
          </div>
        </div>
      </section>

      {/* --- FEATURED TEAM MEMBERS PREVIEW --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <SectionHeading
            label="Our Team"
            title="Key Operatives"
            subtitle="Senior engineers dedicated to excellence"
            align="center"
            className="mb-16"
          />

          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {loading ? (
              <p>Loading...</p>
            ) : (
              team.slice(0, 3).map((member) => (
                <div key={member._id} className="relative group">
                  <SkewContainer variant="glass" className="h-full p-0">
                    <div className="relative">
                      <div className="aspect-[4/5] w-full bg-gray-800 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                        <img
                          src={member.avatarUrl || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-[#FF5F1F]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        {member.socialLinks.github && (
                          <a
                            href={member.socialLinks.github}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white hover:scale-125 transition-transform"
                          >
                            <Github size={32} />
                          </a>
                        )}
                        {member.socialLinks.linkedin && (
                          <a
                            href={member.socialLinks.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white hover:scale-125 transition-transform"
                          >
                            <Linkedin size={32} />
                          </a>
                        )}
                        {member.socialLinks.twitter && (
                          <a
                            href={member.socialLinks.twitter}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white hover:scale-125 transition-transform"
                          >
                            <Twitter size={32} />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="p-6 border-t-2 border-[#333] group-hover:border-[#FF5F1F] bg-[#1a1a1a]">
                      <h3 className="font-display text-2xl font-bold uppercase">{member.name}</h3>
                      <p className="font-mono text-[#FF5F1F] text-xs mb-4 tracking-widest">{member.role}</p>
                      <p className="text-sm text-[#B0B0B0] line-clamp-2">{member.bio}</p>
                    </div>
                  </SkewContainer>
                </div>
              ))
            )}
          </div>

          <div className="text-center">
            <Button href="/team">MEET THE FULL TEAM</Button>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Lightbulb className="mx-auto text-[#FF5F1F] mb-8" size={48} />
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase">Ready to Transform?</h2>
          <p className="text-lg text-[#B0B0B0] mb-8 max-w-2xl mx-auto">
            Let's engineer your next breakthrough. Whether it's scaling infrastructure, enhancing security, or launching
            a new product, we're ready to help.
          </p>
          <Button href="/contact">INITIATE PROJECT</Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
