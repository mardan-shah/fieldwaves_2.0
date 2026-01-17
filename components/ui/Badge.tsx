import type React from "react"

interface BadgeProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "success" | "warning" | "error"
  size?: "sm" | "md" | "lg"
  className?: string
}

const Badge: React.FC<BadgeProps> = ({ children, variant = "primary", size = "md", className = "" }) => {
  const variants = {
    primary: "bg-[#FF5F1F]/20 text-[#FF5F1F] border border-[#FF5F1F]",
    secondary: "bg-[#B0B0B0]/20 text-[#B0B0B0] border border-[#B0B0B0]",
    success: "bg-green-900/20 text-green-500 border border-green-500",
    warning: "bg-yellow-900/20 text-yellow-500 border border-yellow-500",
    error: "bg-red-900/20 text-red-500 border border-red-500",
  }

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  }

  return (
    <span className={`font-mono font-bold inline-block ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  )
}

export default Badge
