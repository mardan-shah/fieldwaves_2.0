import type React from "react"
import SkewContainer from "./SkewContainer"

interface StatCardProps {
  label: string
  value: string | number
  unit?: string
  description?: string
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, description }) => {
  return (
    <SkewContainer variant="glass" className="p-8 h-full">
      <div className="space-y-4">
        <p className="font-mono text-xs text-[#FF5F1F] tracking-widest uppercase px-8">{label}</p>
        <div className="flex items-baseline gap-2 px-4">
          <span className="font-display text-4xl md:text-5xl font-bold">{value}</span>
          {unit && <span className="text-[#B0B0B0] font-mono text-sm">{unit}</span>}
        </div>
        {description && <p className="text-sm text-[#B0B0B0] px-2">{description}</p>}
      </div>
    </SkewContainer>
  )
}

export default StatCard
