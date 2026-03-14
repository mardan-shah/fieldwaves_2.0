"use client"

import Container from "@/components/ui/Container"
import SkewButton from "@/components/ui/SkewButton"
import { Search, X } from "lucide-react"

interface SearchFilterBarProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onSearch?: (query: string) => void // Compatibility
  placeholder?: string
  tags?: string[]
  activeTag?: string | null
  onTagChange?: (tag: string | null) => void
  resultCount?: number
  totalCount?: number
}

export default function SearchFilterBar({
  searchQuery = "",
  onSearchChange,
  onSearch,
  placeholder = "SEARCH...",
  tags = [],
  activeTag = null,
  onTagChange,
  resultCount,
  totalCount,
}: SearchFilterBarProps) {
  const handleChange = (val: string) => {
    if (onSearchChange) onSearchChange(val)
    if (onSearch) onSearch(val)
  }

  const clearSearch = () => {
    handleChange("")
  }

  return (
    <div className="max-w-7xl mx-auto px-6 mb-12">
      <div className="flex flex-col gap-6">
        {/* Search Input */}
        <Container variant="ghost" className="p-0 overflow-hidden border border-border focus-within:border-primary transition-colors">
          <div className="relative w-full group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              <Search size={16} className="text-muted group-focus-within:text-primary transition-colors" />
              <div className="h-4 w-px bg-border group-focus-within:bg-primary/30" />
            </div>
            
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-transparent text-white pl-14 pr-12 py-4 outline-none font-mono text-sm placeholder:text-muted/50 transition-colors uppercase tracking-wider"
            />

            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-colors"
              >
                <X size={16} />
              </button>
            )}

            {resultCount !== undefined && totalCount !== undefined && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 font-mono text-[9px] text-muted tracking-widest bg-background/50 px-2 py-1 border border-border/50">
                <span className="text-primary font-bold">{resultCount}</span>
                <span className="opacity-30">/</span>
                <span>{totalCount}</span>
              </div>
            )}
          </div>
        </Container>

        {/* Tag Filters */}
        {tags.length > 0 && onTagChange && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-mono text-[10px] text-muted uppercase tracking-[0.2em] mr-2">FILTER_BY:</span>
            <SkewButton 
              variant={!activeTag ? "primary" : "outline"}
              size="sm"
              onClick={() => onTagChange(null)}
              className="h-8"
            >
              ALL_UNITS
            </SkewButton>
            {tags.map(tag => (
              <SkewButton 
                key={tag} 
                variant={activeTag === tag ? "primary" : "outline"}
                size="sm"
                onClick={() => onTagChange(activeTag === tag ? null : tag)}
                className="h-8"
              >
                {tag.toUpperCase()}
              </SkewButton>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
