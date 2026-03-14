import type React from "react"
import Container from "./ui/Container"
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
    <Container variant="glass" className="p-8 h-full flex flex-col">
      <div className="flex gap-1 mb-4">
        {[...Array(rating)].map((_, i) => (
          <Star key={i} size={16} fill="var(--primary)" color="var(--primary)" />
        ))}
      </div>

      <p className="text-lg text-secondary mb-8 flex-grow italic">"{quote}"</p>

      <div className="flex items-center gap-4 border-t border-border pt-6">
        <img src={avatar || "/placeholder.svg"} alt={author} className="w-12 h-12 rounded-full grayscale" />
        <div>
          <p className="font-display font-bold text-white">{author}</p>
          <p className="font-mono text-xs text-primary">
            {title} @ {company}
          </p>
        </div>
      </div>
    </Container>
  )
}

export default TestimonialCard
