export interface SocialLinks {
  twitter?: string
  github?: string
  linkedin?: string
  website?: string
  email?: string
}

export interface TeamMember {
  _id: string
  name: string
  role: string
  bio: string
  socialLinks: SocialLinks
  avatarUrl: string
  backgroundColor: string
  isOwner: boolean
  order: number
}

export interface Project {
  _id: string
  title: string
  description: string
  liveUrl: string
  screenshotUrl: string
  techStack: string[]
  order: number
  featured: boolean
}

export interface MetricCard {
  label: string
  value: string
  unit: string
}

export interface CaseStudy {
  _id: string
  title: string
  slug: string
  subtitle: string
  overview: string
  description: string
  coverImage: string
  metricCards: MetricCard[]
  techStack: string[]
  published: boolean
  featured: boolean
  order: number
  views: number
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  keywords: string[]
  tags: string[]
  author: string
  published: boolean
  featured: boolean
  order: number
  views: number
  createdAt: string
  updatedAt: string
}

export interface GlobalSettings {
  soloMode: boolean
  maintenanceMode: boolean
  maintenanceMessage: string
  casesDisplayCount: number
}

export type Variant = "primary" | "secondary" | "outline" | "ghost"
export type Size = "sm" | "md" | "lg"
