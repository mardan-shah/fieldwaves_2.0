import type React from "react"
import SkewContainer from "./ui/SkewContainer"
import type { LucideIcon as LucideIconType } from "lucide-react"
import LucideIcon from "./ui/LucideIcon"

interface ServiceCardProps {
  icon?: LucideIconType
  iconName?: string
  title: string
  description: string
  features: string[]
  index?: number
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon: Icon, iconName, title, description, features, index = 1 }) => {
  return (
    <SkewContainer variant="glass" className="p-8 h-full group hover:bg-background/60 transition-all border-t-2 border-t-transparent hover:border-t-primary">
      <div className="flex justify-between items-start mb-6">
        {iconName ? (
           <LucideIcon name={iconName} className="text-primary group-hover:scale-110 transition-transform" size={40} strokeWidth={1.5} />
        ) : Icon ? (
          <Icon className="text-primary group-hover:scale-110 transition-transform" size={40} strokeWidth={1.5} />
        ) : null}
        <div className="flex flex-col items-end font-mono text-[10px] opacity-40">
          <span>DEPLOY_READY</span>
          <span>SRV_0{index}</span>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h3 className="font-display text-2xl font-bold mb-3 uppercase tracking-tight">{title}</h3>
          <p className="text-secondary text-sm leading-relaxed mb-4">{description}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-4 border-t border-secondary/10">
          {features.map((feature, i) => (
            <div key={i} className="flex gap-2 items-center text-[10px] font-mono uppercase tracking-widest text-secondary group-hover:text-white transition-colors">
              <div className="w-1 h-1 bg-primary shrink-0"></div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </SkewContainer>
  )
}

export default ServiceCard
