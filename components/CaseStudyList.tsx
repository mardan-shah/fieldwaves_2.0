"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import CaseStudyCard from "@/components/CaseStudyCard"
import SearchFilterBar from "@/components/SearchFilterBar"
import Container from "@/components/ui/Container"
import Button from "@/components/ui/SkewButton"
import type { iCaseStudy } from "@/types"

interface CaseStudyListProps {
  caseStudies: iCaseStudy[]
  initialDisplayCount: number
}

export default function CaseStudyList({ caseStudies, initialDisplayCount }: CaseStudyListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [displayCount, setDisplayCount] = useState(initialDisplayCount)

  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  const allTechs = useMemo(() => {
    const techSet = new Set<string>()
    caseStudies.forEach(cs => cs.techStack.forEach(t => techSet.add(t)))
    return Array.from(techSet).sort()
  }, [caseStudies])

  const filtered = useMemo(() => {
    let result = caseStudies
    
    if (selectedTag) {
      result = result.filter(cs => cs.techStack.includes(selectedTag))
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(cs => 
        cs.title.toLowerCase().includes(q) || 
        cs.subtitle.toLowerCase().includes(q) ||
        cs.overview.toLowerCase().includes(q) ||
        cs.techStack.some(t => t.toLowerCase().includes(q))
      )
    }
    return result
  }, [caseStudies, searchQuery, selectedTag])

  const visible = filtered.slice(0, displayCount)

  return (
    <div className="space-y-12">
      {/* Search & Filter */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="FILTER_CASES // title, client, stack..."
        tags={allTechs}
        activeTag={selectedTag}
        onTagChange={setSelectedTag}
        resultCount={filtered.length}
        totalCount={caseStudies.length}
      />

      {/* Case Studies */}
      <section className="py-4 space-y-24">
        {visible.length > 0 ? (
          visible.map((caseStudy, i) => (
            <CaseStudyCard 
              key={caseStudy._id} 
              caseStudy={caseStudy} 
              imagePosition={i % 2 === 0 ? "left" : "right"}
            />
          ))
        ) : (
          <div className="text-center py-24 border border-dashed border-border">
            <p className="font-mono text-secondary text-sm">NO_MATCHING_CASES_FOUND</p>
          </div>
        )}
      </section>

      {/* Load More */}
      {filtered.length > displayCount && (
        <div className="flex justify-center pt-12">
          <button onClick={() => setDisplayCount(prev => prev + initialDisplayCount)}>
            <Button variant="outline" className="px-12 py-4">
              LOAD_MORE_ARCHIVES
            </Button>
          </button>
        </div>
      )}
    </div>
  )
}
