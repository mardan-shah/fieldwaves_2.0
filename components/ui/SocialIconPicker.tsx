"use client"

import { Github, Linkedin, Twitter, Globe, Mail } from "lucide-react"
import Container from "./Container"

export const SOCIAL_PLATFORMS = [
  {
    name: "github",
    label: "GitHub",
    icon: Github,
    placeholder: "https://github.com/username",
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    icon: Linkedin,
    placeholder: "https://linkedin.com/in/username",
  },
  {
    name: "twitter",
    label: "Twitter",
    icon: Twitter,
    placeholder: "https://twitter.com/username",
  },
  {
    name: "website",
    label: "Website",
    icon: Globe,
    placeholder: "https://yourwebsite.com",
  },
  {
    name: "email",
    label: "Email",
    icon: Mail,
    placeholder: "your@email.com",
  },
]

interface SocialIconPickerProps {
  selected: string
  onChange: (platform: string) => void
}

export default function SocialIconPicker({ selected, onChange }: SocialIconPickerProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {SOCIAL_PLATFORMS.map((platform) => {
        const Icon = platform.icon
        const isSelected = selected === platform.name
        return (
          <button
            key={platform.name}
            type="button"
            onClick={() => onChange(platform.name)}
            className="group"
            title={platform.label}
          >
            <Container
              variant={isSelected ? "primary" : "ghost"}
              className="p-3 flex items-center justify-center"
              hoverEffect
            >
              <Icon size={20} />
            </Container>
          </button>
        )
      })}
    </div>
  )
}

export function getSocialIcon(platform: string) {
  const social = SOCIAL_PLATFORMS.find((s) => s.name === platform)
  return social?.icon
}
