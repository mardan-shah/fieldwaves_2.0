import type React from "react"
import SkewContainer from "./ui/SkewContainer"
import { Star } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  title: string
  company: string
  avatar: string
  rating?: number
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, title, company, avatar, rating = 5 }) => {
  return (
    <SkewContainer variant="glass" className="p-8 h-full flex flex-col">
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} fill="#FF5F1F" color="#FF5F1F" />
        ))}
      </div>

      <p className="text-lg text-[#B0B0B0] mb-8 flex-grow italic">"{quote}"</p>

      <div className="flex items-center gap-4 border-t border-[#333] pt-6">
        <img src={avatar || "/placeholder.svg"} alt={author} className="w-12 h-12 rounded-full grayscale" />
        <div>
          <p className="font-display font-bold text-white">{author}</p>
          <p className="font-mono text-xs text-[#FF5F1F]">
            {title} @ {company}
          </p>
        </div>
      </div>
    </SkewContainer>
  )
}

export default TestimonialCard
