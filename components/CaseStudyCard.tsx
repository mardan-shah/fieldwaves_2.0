"use client"

import Link from "next/link"
import SkewContainer from "@/components/ui/SkewContainer"
import Button from "@/components/ui/SkewButton"
import type { CaseStudy } from "@/types"

interface CaseStudyCardProps {
  caseStudy: CaseStudy
  imagePosition: "left" | "right"
}

export default function CaseStudyCard({ caseStudy, imagePosition }: CaseStudyCardProps) {
  const isRight = imagePosition === "right"

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <SkewContainer
          variant="ghost"
          className={`h-80 overflow-hidden ${isRight ? "md:order-2" : ""}`}
        >
          <img
            src={caseStudy.coverImage || "https://picsum.photos/seed/case/800/600"}
            alt={caseStudy.title}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-200 scale-110 hover:scale-100"
          />
        </SkewContainer>

        {/* Content */}
        <div className={isRight ? "md:order-1" : ""}>
          <div className="mb-4">
            {caseStudy.subtitle && (
              <p className="font-mono text-xs text-primary tracking-widest uppercase mb-2">
                {caseStudy.subtitle}
              </p>
            )}
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {caseStudy.title}
            </h2>
          </div>
          <p className="text-lg text-secondary mb-8">{caseStudy.overview}</p>

          {/* Metric Cards */}
          {caseStudy.metricCards.length > 0 && (
            <div
              className="grid gap-4 mb-8"
              style={{
                gridTemplateColumns: `repeat(${Math.min(caseStudy.metricCards.length, 3)}, minmax(0, 1fr))`,
              }}
            >
              {caseStudy.metricCards.map((metric, idx) => (
                <SkewContainer key={idx} variant="glass" className="p-4">
                  <p className="font-mono text-xs text-primary mb-2">{metric.label}</p>
                  <p className="font-display text-2xl font-bold">{metric.value}</p>
                  <p className="text-xs text-secondary">{metric.unit}</p>
                </SkewContainer>
              ))}
            </div>
          )}

          {/* Tech Stack */}
          {caseStudy.techStack.length > 0 && (
            <div className="mb-8">
              <p className="font-mono text-xs text-secondary mb-3">TECH STACK</p>
              <div className="flex flex-wrap gap-2">
                {caseStudy.techStack.map((tech) => (
                  <SkewContainer key={tech} variant="outline" className="px-3 py-1">
                    <span className="font-mono text-xs">{tech}</span>
                  </SkewContainer>
                ))}
              </div>
            </div>
          )}

          <Link href={`/cases/${caseStudy.slug}`}>
            <Button>View Full Case Study</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
