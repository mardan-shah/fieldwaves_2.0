"use client"

import Link from "next/link"
import Container from "@/components/ui/Container"
import Button from "@/components/ui/SkewButton"
import type { iCaseStudy } from "@/types"
import S3Image from "./ui/S3Image"

interface CaseStudyCardProps {
  caseStudy: iCaseStudy
  imagePosition: "left" | "right"
}

export default function CaseStudyCard({ caseStudy, imagePosition }: CaseStudyCardProps) {
  const isRight = imagePosition === "right"

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className={`order-2 ${isRight ? "md:order-1" : "md:order-2"} py-8`}>
          <div className="space-y-4">
            {caseStudy.subtitle && (
              <div className="inline-block px-3 py-1 bg-primary/10 border-l-2 border-primary - mb-4">
                <span className="font-mono text-[10px] text-primary tracking-[0.3em] uppercase block ">
                  {caseStudy.subtitle}
                </span>
              </div>
            )}
            <h2 className="font-display font-bold text-4xl md:text-5xl tracking-wide uppercase">
              {caseStudy.title}
            </h2>
          </div>
          <p className="text-lg text-secondary mb-8 leading-relaxed mt-6 max-w-xl">
            {caseStudy.overview}
          </p>

          {caseStudy.metricCards.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {caseStudy.metricCards.map((metric, idx) => (
                <div key={idx} className="border border-border p-4 bg-card/50 hover:border-primary/30 transition-colors group/metric -">
                  <div className="">
                    <p className="font-display font-bold text-2xl text-white">
                      {metric.value}
                      <span className="text-[10px] ml-1 text-primary font-mono align-top">{metric.unit}</span>
                    </p>
                    <p className="font-mono text-[9px] text-muted uppercase tracking-widest mt-1 group-hover/metric:text-secondary transition-colors">
                      {metric.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {caseStudy.techStack.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-10">
              {caseStudy.techStack.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-input border border-border text-[10px] font-mono text-secondary uppercase - hover:border-primary/50 transition-colors cursor-default">
                  <span className="inline-block ">{tech}</span>
                </span>
              ))}
            </div>
          )}

          <div className="flex">
            <Link href={`/cases/${caseStudy.slug}`}>
              <Button variant="primary" className="px-10 py-4">
                EXPLORE_CASE_STUDY
              </Button>
            </Link>
          </div>
        </div>

        <div className={`order-1 ${isRight ? "md:order-2" : "md:order-1"}`}>
          <Container variant="outline" className="aspect-[4/3] overflow-hidden bg-card" hoverEffect>
            <S3Image 
              src={caseStudy.coverImage} 
              alt={caseStudy.title}
              fallbackSrc="https://picsum.photos/seed/case/800/600"
              className="w-full h-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
            />
          </Container>
        </div>
      </div>
    </div>
  )
}
