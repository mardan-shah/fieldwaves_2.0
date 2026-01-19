import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import SectionHeading from "../../components/ui/SectionHeading"
import Button from "../../components/ui/Button"
import SkewContainer from "../../components/ui/SkewContainer"
import { GitBranch, Lock, Zap, Lightbulb, Code2, Award } from "lucide-react"

export default function PhilosophyPage() {
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <SectionHeading label="Our Core Values" title="SYS_DIAGNOSTIC" subtitle="What sets us apart from the rest" />
        </div>
      </section>

      {/* Philosophy Comparison */}
      <section className="py-24 bg-[#141414]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 mb-24">
            {/* The Others */}
            <div className="opacity-60 hover:opacity-100 transition-opacity">
              <h3 className="font-mono text-[#B0B0B0] mb-6 text-xl">// OTHERS.EXE</h3>
              <div className="space-y-4">
                <SkewContainer variant="ghost" className="border-red-900/50 bg-red-900/10 p-6">
                  <h4 className="font-bold text-red-500 mb-2">SPAGHETTI CODE</h4>
                  <p className="text-sm text-gray-500">Unmaintainable AI-generated slop that breaks in production.</p>
                </SkewContainer>
                <SkewContainer variant="ghost" className="border-red-900/50 bg-red-900/10 p-6">
                  <h4 className="font-bold text-red-500 mb-2">SECURITY HOLES</h4>
                  <p className="text-sm text-gray-500">Exposed ENV variables and weak auth patterns.</p>
                </SkewContainer>
                <SkewContainer variant="ghost" className="border-red-900/50 bg-red-900/10 p-6">
                  <h4 className="font-bold text-red-500 mb-2">UNSCALABLE DESIGN</h4>
                  <p className="text-sm text-gray-500">Monoliths that crumble under real-world load.</p>
                </SkewContainer>
                <SkewContainer variant="ghost" className="border-red-900/50 bg-red-900/10 p-6">
                  <h4 className="font-bold text-red-500 mb-2">TECHNICAL DEBT</h4>
                  <p className="text-sm text-gray-500">Shortcuts that compound costs over time.</p>
                </SkewContainer>
              </div>
            </div>

            {/* FieldWaves */}
            <div>
              <h3 className="font-mono text-[#FF5F1F] mb-6 text-xl">// FIELDWAVES.SYS</h3>
              <div className="space-y-4">
                <SkewContainer variant="glass" className="p-6">
                  <div className="flex gap-4 items-start">
                    <GitBranch className="text-[#FF5F1F] shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-white mb-1">RACE-CONDITION HANDLING</h4>
                      <p className="text-sm text-[#B0B0B0]">
                        Robust state management for high-concurrency environments.
                      </p>
                    </div>
                  </div>
                </SkewContainer>

                <SkewContainer variant="glass" className="p-6">
                  <div className="flex gap-4 items-start">
                    <Lock className="text-[#FF5F1F] shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-white mb-1">ENTERPRISE SECURITY</h4>
                      <p className="text-sm text-[#B0B0B0]">
                        NextAuth v5, strict CSP, and sanitized inputs by default.
                      </p>
                    </div>
                  </div>
                </SkewContainer>

                <SkewContainer variant="glass" className="p-6">
                  <div className="flex gap-4 items-start">
                    <Zap className="text-[#FF5F1F] shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-white mb-1">PERFORMANCE FIRST</h4>
                      <p className="text-sm text-[#B0B0B0]">
                        Optimization woven into architecture, not bolted on after.
                      </p>
                    </div>
                  </div>
                </SkewContainer>

                <SkewContainer variant="glass" className="p-6">
                  <div className="flex gap-4 items-start">
                    <Code2 className="text-[#FF5F1F] shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-white mb-1">MAINTAINABILITY</h4>
                      <p className="text-sm text-[#B0B0B0]">Clean code that your team can own and extend.</p>
                    </div>
                  </div>
                </SkewContainer>
              </div>
            </div>
          </div>

          {/* Core Principles */}
          <SectionHeading
            label="Core Principles"
            title="How We Work"
            subtitle="The foundation of every project"
            align="center"
            className="mb-16"
          />

          <div className="grid md:grid-cols-3 gap-8">
            <SkewContainer variant="ghost" className="p-8 group" hoverEffect>
              <Code2 className="text-[#FF5F1F] mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="font-display text-xl font-bold mb-3">Clean Architecture</h3>
              <p className="text-[#B0B0B0]">
                Every line of code follows SOLID principles. Your system stays maintainable for years to come.
              </p>
            </SkewContainer>

            <SkewContainer variant="ghost" className="p-8 group" hoverEffect>
              <Lock className="text-[#FF5F1F] mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="font-display text-xl font-bold mb-3">Security First</h3>
              <p className="text-[#B0B0B0]">
                Enterprise-grade security isn't an afterthought. It's woven into every decision we make.
              </p>
            </SkewContainer>

            <SkewContainer variant="ghost" className="p-8 group" hoverEffect>
              <Award className="text-[#FF5F1F] mb-6 group-hover:scale-110 transition-transform" size={40} />
              <h3 className="font-display text-xl font-bold mb-3">Long-term Support</h3>
              <p className="text-[#B0B0B0]">We're invested in your success. Our team stands behind every deployment.</p>
            </SkewContainer>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Lightbulb className="mx-auto text-[#FF5F1F] mb-8" size={48} />
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 uppercase">Ready to Partner?</h2>
          <p className="text-lg text-[#B0B0B0] mb-8 max-w-2xl mx-auto">
            Let's build something that lasts. Contact us to discuss your project.
          </p>
          <Button href="/contact">START CONVERSATION</Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
