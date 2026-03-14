import React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "white"
  fullPage?: boolean
  label?: string
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = "md", 
  variant = "primary",
  fullPage = false,
  label,
  className = "" 
}) => {
  const sizes = {
    sm: "size-4 border-2",
    md: "size-8 border-[3px]",
    lg: "size-12 border-4",
  }

  const variants = {
    primary: "border-primary",
    secondary: "border-secondary",
    white: "border-white",
  }

  const spinner = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-t-transparent border-r-transparent",
          sizes[size],
          variants[variant]
        )}
      />
      {label && (
        <span className="text-sm font-bold tracking-widest uppercase animate-pulse">
          {label}
        </span>
      )}
    </div>
  )

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default LoadingSpinner