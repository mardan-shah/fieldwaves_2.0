import SkewContainer from "../components/ui/SkewContainer"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Button from "../components/ui/SkewButton"
import StatCard from "../components/ui/StatCard"
import SectionHeading from "../components/ui/SectionHeading"
import ProjectGrid from "../components/ProjectGrid"
import TeamGrid from "../components/TeamGrid"
import { getProjects, getTeam } from "./actions/public"
import { Lightbulb } from "lucide-react"

export default async function Home() {
  const [projects, team] = await Promise.all([getProjects(), getTeam()])

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden selection:bg-[#FF5F1F] selection:text-white pb-20">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#B0B0B0 1px, transparent 1px), linear-gradient(90deg, #B0B0B0 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-14 md:px-6 w-full">
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

            <div className="max-w-2xl bg-[#1a1a1a]/80 backdrop-blur-sm border-l-4 border-[#FF5F1F] pl-6 py-2 -skew-x-12">
              <div className="skew-x-12">
                <p className="text-xl md:text-2xl text-[#B0B0B0] font-light">
                  We use AI not to copy-paste, but to accelerate{" "}
                  <span className="text-white font-bold">senior-level security</span> and{" "}
                  <span className="text-white font-bold">architectural rigor</span>.
                </p>
              </div>
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
        <div className="max-w-7xl mx-auto px-14 md:px-6">
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard
              label="Projects Delivered"
              value={`${projects.length}+`}
              description="Enterprise-scale solutions"
            />
            <StatCard label="Uptime" value="99.99%" description="Average reliability" />
            <StatCard label="Performance" value="89%" description="Average improvement" />
            <StatCard
              label="Team Members"
              value={`${team.length}+`}
              description="Senior engineers"
            />
          </div>
        </div>
      </section>

      {/* --- FEATURED PROJECTS PREVIEW --- */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-14 md:px-6">
          <SectionHeading
            label="Recent Work"
            title="Featured Deployments"
            subtitle="A selection of our latest enterprise solutions"
            align="right"
            className="mb-16"
          />

          <div className="mb-12">
            <ProjectGrid projects={projects.slice(0, 3)} />
          </div>

          <div className="text-center">
            <Button href="/projects">VIEW ALL PROJECTS</Button>
          </div>
        </div>
      </section>

      {/* --- FEATURED TEAM MEMBERS PREVIEW --- */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-14 md:px-6 relative z-10">
          <SectionHeading
            label="Our Team"
            title="Key Operatives"
            subtitle="Senior engineers dedicated to excellence"
            align="center"
            className="mb-16"
          />

          <div className="mb-12">
            <TeamGrid team={team.slice(0, 3)} />
          </div>

          <div className="text-center">
            <Button href="/team">MEET THE FULL TEAM</Button>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-4xl mx-auto px-14 md:px-6 text-center">
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
