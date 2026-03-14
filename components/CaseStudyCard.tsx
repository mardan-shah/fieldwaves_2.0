"use client"

import Link from "next/link"
import Container from "@/components/ui/Container"
import Button from "@/components/ui/SkewButton"
import type { iCaseStudy } from "@/types"

interface CaseStudyCardProps {
  caseStudy: iCaseStudy
  imagePosition: "left" | "right"
}

export default function CaseStudyCard({ caseStudy, imagePosition }: CaseStudyCardProps) {
  const isRight = imagePosition === "right"

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className={`order-2 ${isRight ? "md:order-1" : "md:order-2"}`}>
          <div className="space-y-4">
            {caseStudy.subtitle && (
              <span className="font-mono text-[10px] text-primary tracking-[0.3em] uppercase block mb-2">
                {caseStudy.subtitle}
              </span>
            )}
            <h2 className="font-display font-bold text-4xl md:text-5xl tracking-wide">
              {caseStudy.title}
            </h2>
          </div>
          <p className="text-lg text-secondary mb-8 leading-relaxed mt-6">
            {caseStudy.overview}
          </p>

          {caseStudy.metricCards.length > 0 && (
            <div 
              className="grid gap-4 mb-8"
              style={{ 
                gridTemplateColumns: `repeat(${Math.min(caseStudy.metricCards.length, 3)}, minmax(0, 1fr))` 
              }}
            >
              {caseStudy.metricCards.map((metric, idx) => (
                <div key={idx} className="border border-border p-4 bg-card/50">
                  <p className="font-display font-bold text-xl text-white">{metric.value}{metric.unit}</p>
                  <p className="font-mono text-[9px] text-muted uppercase tracking-widest">{metric.label}</p>
                </div>
              ))}
            </div>
          )}

          {caseStudy.techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {caseStudy.techStack.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-input border border-border text-[10px] font-mono text-secondary uppercase">
                  {tech}
                </span>
              ))}
            </div>
          )}

          <Link href={`/cases/${caseStudy.slug}`}>
            <Button variant="outline" className="px-8 py-3">
              EXPLORE_CASE_STUDY
            </Button>
          </Link>
        </div>

        <div className={`order-1 ${isRight ? "md:order-2" : "md:order-1"}`}>
          <Container variant="outline" className="aspect-[4/3] overflow-hidden bg-card" hoverEffect>
            <img 
              src={caseStudy.coverImage || "https://picsum.photos/seed/case/800/600"} 
              alt={caseStudy.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </Container>
        </div>
      </div>
    </div>
  )
}
