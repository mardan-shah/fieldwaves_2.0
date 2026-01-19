"use client"

import { useEffect, useState } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import SectionHeading from "../../components/ui/SectionHeading"
import Button from "../../components/ui/Button"
import SkewContainer from "../../components/ui/SkewContainer"
import { getProjects } from "../actions/public"
import type { Project } from "../../types"
import { ArrowUpRight } from "lucide-react"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects()
        // @ts-ignore
        setProjects(data)
      } catch (error) {
        console.error("Failed to fetch projects", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

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
          <SectionHeading label="Recent Work" title="DEPLOYMENTS" subtitle="Enterprise solutions in production" />
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-14 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <p className="font-mono text-[#FF5F1F] animate-pulse">LOADING_DATA_STREAM...</p>
            ) : (
              projects.map((project) => (
                <SkewContainer key={project._id} variant="ghost" className="h-full group" hoverEffect>
                  <div className="flex flex-col h-full -skew-x-12">
                    {/* Image Area */}
                    <div className="h-48 w-full bg-black relative overflow-hidden border-b-2 border-[#333] group-hover:border-[#FF5F1F] transition-colors">
                      <img
                        src={project.screenshotUrl || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-125 group-hover:scale-110 skew-x-12"
                      />
                      <div className="absolute top-2 right-2 skew-x-12">
                        <SkewContainer variant="primary" className="p-1 px-2">
                          <ArrowUpRight size={16} />
                        </SkewContainer>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col grow bg-[#1a1a1a]">
                      <div className="skew-x-12 h-full flex flex-col">
                        <h3 className="font-display text-xl font-bold mb-2">{project.title}</h3>
                        <p className="text-sm text-[#B0B0B0] mb-4 grow">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.techStack.map((tech) => (
                            <span key={tech} className="text-xs font-mono text-[#B0B0B0] border border-[#333] px-2 py-1">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </SkewContainer>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-14 md:px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase">Impressed?</h2>
          <p className="text-lg text-[#B0B0B0] mb-8 max-w-2xl mx-auto">
            Let's talk about bringing your next vision to life.
          </p>
          <Button href="/contact">SCHEDULE A CALL</Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
