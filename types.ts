export interface SocialLinks {
  twitter?: string
  github?: string
  linkedin?: string
  website?: string
  email?: string
}

export interface TeamProject {
  id: string
  title: string
  description: string
  url?: string
  techStack?: string[]
}

export interface TeamMember {
  _id: string
  name: string
  role: string
  bio: string
  socialLinks: SocialLinks
  projects?: TeamProject[]
  avatarUrl: string
  isOwner: boolean
  order: number
}

export interface Project {
  _id: string
  title: string
  description?: string
  liveUrl: string

  screenshotUrl: string
  techStack: string[]
}

export interface GlobalSettings {
  soloMode: boolean
  maintenanceMode: boolean
}

export type Variant = "primary" | "secondary" | "outline" | "ghost"
export type Size = "sm" | "md" | "lg"
