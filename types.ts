export interface iSocialLinks {
  twitter?: string
  github?: string
  linkedin?: string
  website?: string
  email?: string
}

export interface iTeamMember {
  _id: string
  name: string
  role: string
  bio: string
  socialLinks: iSocialLinks
  avatarUrl: string
  backgroundColor: string
  isOwner: boolean
  order: number
}

export interface iProject {
  _id: string
  title: string
  description: string
  liveUrl: string
  screenshotUrl: string
  screenshots?: string[]
  techStack: string[]
  order: number
  featured: boolean
  githubUrl?: string
}


export interface iMetricCard {
  label: string
  value: string
  unit: string
}

export interface iCaseStudy {
  _id: string
  title: string
  slug: string
  subtitle: string
  overview: string
  description: string
  coverImage: string
  metricCards: iMetricCard[]
  techStack: string[]
  published: boolean
  featured: boolean
  order: number
  views: number
  createdAt: string
  updatedAt: string
}

export interface iBlogPost {
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

export interface iGlobalSettings {
  soloMode: boolean
  maintenanceMode: boolean
  maintenanceMessage: string
  casesDisplayCount: number
}

export interface iService {
  _id: string;
  active: boolean;
  description: string;
  iconName: string;
  order: number;
  title: string;
  features: string[];
}


export type iVariant = "primary" | "secondary" | "outline" | "ghost"
export type iSize = "sm" | "md" | "lg"
