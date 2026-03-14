"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Container from "@/components/ui/Container"
import SearchFilterBar from "@/components/SearchFilterBar"
import type { iCaseStudy } from "@/types"
import { Eye } from "lucide-react"
import { useInView } from "@/hooks/use-in-view"

interface CaseStudyGridProps {
  caseStudies: iCaseStudy[]
}

export default function CaseStudyGrid({ caseStudies }: CaseStudyGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTech, setActiveTech] = useState<string | null>(null)
  const { ref: gridRef, isInView } = useInView()

  const allTechs = useMemo(() => {
    const techSet = new Set<string>()
    caseStudies.forEach(cs => cs.techStack.forEach(t => techSet.add(t)))
    return Array.from(techSet)
  }, [caseStudies])

  const filtered = useMemo(() => {
    return caseStudies.filter(cs => {
      const matchesSearch = !searchQuery || 
        cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.overview.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesTech = !activeTech || cs.techStack.includes(activeTech)
      
      return matchesSearch && matchesTech
    })
  }, [caseStudies, searchQuery, activeTech])

  return (
    <div className="space-y-12">
      {/* Search & Filter */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="SEARCH_PORTFOLIO // title, overview..."
        tags={allTechs}
        activeTag={activeTech}
        onTagChange={setActiveTech}
        resultCount={filtered.length}
        totalCount={caseStudies.length}
      />

      {/* Grid */}
      <div 
        ref={gridRef}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filtered.map((cs, i) => (
          <Link 
            key={cs._id} 
            href={`/cases/${cs.slug}`}
            className={`group transition-all duration-500 delay-[${i * 100}ms] ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <Container variant="outline" className="h-full bg-card overflow-hidden" hoverEffect>
              <div className="aspect-video overflow-hidden border-b border-border">
                <img 
                  src={cs.coverImage || "https://picsum.photos/seed/case/800/600"} 
                  alt={cs.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] text-primary tracking-widest uppercase">{cs.subtitle}</span>
                  <div className="flex gap-1">
                    {cs.techStack.slice(0, 2).map(tech => (
                      <span key={tech} className="px-2 py-0.5 bg-input border border-border text-[9px] font-mono text-muted">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl mb-3 tracking-wide group-hover:text-primary transition-colors">
                  {cs.title}
                </h3>
                <p className="text-secondary text-sm line-clamp-3 mb-6 leading-relaxed">
                  {cs.overview}
                </p>
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-primary">
                  VIEW_PROJECT <Eye size={12} />
                </div>
              </div>
            </Container>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 border border-dashed border-border">
          <p className="font-mono text-secondary text-sm">NO_MATCHING_CASES_FOUND</p>
        </div>
      )}
    </div>
  )
}
