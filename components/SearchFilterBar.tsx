"use client"

import SkewContainer from "@/components/ui/SkewContainer"
import { Search } from "lucide-react"

interface SearchFilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  placeholder?: string
  tags?: string[]
  activeTag?: string | null
  onTagChange?: (tag: string | null) => void
  resultCount?: number
  totalCount?: number
}

export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
  placeholder = "Search...",
  tags = [],
  activeTag = null,
  onTagChange,
  resultCount,
  totalCount,
}: SearchFilterBarProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 mb-12">
      <div className="flex flex-col gap-4">
        {/* Search Input */}
        <SkewContainer variant="ghost" className="p-0 overflow-hidden">
          <div className="relative w-full">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-white pl-11 pr-4 py-3 outline-none font-mono text-sm placeholder:text-muted transition-colors focus:bg-input/50"
            />
            {resultCount !== undefined && totalCount !== undefined && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-muted tracking-wider">
                {resultCount}/{totalCount}
              </span>
            )}
          </div>
        </SkewContainer>

        {/* Tag Filters */}
        {tags.length > 0 && onTagChange && (
          <div className="flex flex-wrap gap-2">
            <button onClick={() => onTagChange(null)}>
              <SkewContainer
                variant={!activeTag ? "primary" : "ghost"}
                className="px-3 py-1.5"
              >
                <span className="font-mono text-xs tracking-wider">ALL</span>
              </SkewContainer>
            </button>
            {tags.map(tag => (
              <button key={tag} onClick={() => onTagChange(activeTag === tag ? null : tag)}>
                <SkewContainer
                  variant={activeTag === tag ? "primary" : "ghost"}
                  className="px-3 py-1.5"
                >
                  <span className="font-mono text-xs tracking-wider">{tag}</span>
                </SkewContainer>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
