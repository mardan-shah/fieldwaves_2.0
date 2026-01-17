import type React from "react"
import SkewContainer from "./ui/SkewContainer"
import type { LucideIcon } from "lucide-react"

interface ServiceCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, title, description, features }) => {
  return (
    <SkewContainer variant="glass" className="p-8 h-full group hover:bg-[#1a1a1a]/60 transition-all">
      <div className="space-y-6">
        <Icon className="text-[#FF5F1F] group-hover:scale-110 transition-transform" size={32} strokeWidth={2} />
        <div>
          <h3 className="font-display text-2xl font-bold mb-3 uppercase">{title}</h3>
          <p className="text-[#B0B0B0] text-sm leading-relaxed mb-4">{description}</p>
        </div>
        <div className="space-y-2">
          {features.map((feature, i) => (
            <div key={i} className="flex gap-3 items-start text-sm">
              <div className="w-1.5 h-1.5 bg-[#FF5F1F] rounded-full mt-2 shrink-0"></div>
              <span className="text-[#B0B0B0]">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </SkewContainer>
  )
}

export default ServiceCard
