import type React from "react"
import SkewContainer from "./SkewContainer"

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  description?: string
  index?: number
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, description, index = 1 }) => {
  return (
    <SkewContainer variant="glass" className="p-8 h-full relative overflow-hidden group">
      <div className="absolute top-2 right-4 font-mono text-[8px] opacity-30 select-none">
        MTR_REF_{label.slice(0, 3).toUpperCase()}_00{index}
      </div>
      <div className="space-y-4">
        <p className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase">{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="font-display text-4xl md:text-5xl font-bold group-hover:text-primary transition-colors">{value}</span>
          {unit && <span className="text-secondary font-mono text-sm">{unit}</span>}
        </div>
        <div className="h-1 w-full bg-secondary/20 relative">
          <div className="absolute inset-0 bg-primary/40 w-[60%] group-hover:w-[90%] transition-all duration-700" />
        </div>
        {description && <p className="text-xs text-secondary leading-relaxed uppercase tracking-wide opacity-80">{description}</p>}
      </div>
    </SkewContainer>
  )
}

export default StatCard
