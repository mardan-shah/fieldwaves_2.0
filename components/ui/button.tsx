"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils" // Ensure this helper exists, or use template literals

export const buttonVariants = ({ 
  variant = "primary", 
  size = "md", 
  className = "" 
}: { 
  variant?: "primary" | "secondary" | "outline" | "ghost", 
  size?: "sm" | "md" | "lg" | "icon", 
  className?: string 
  } = {}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-wider transition-all hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none"

  const variantClasses = {
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border-2 border-primary text-primary bg-transparent",
    ghost: "hover:bg-accent hover:text-accent-foreground",
  }

  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    icon: "h-10 w-10 p-0",
  }

  return cn(baseStyles, variantClasses[variant], sizeClasses[size], className)
}

interface ButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg" | "icon"
  className?: string
  onClick?: (e: React.MouseEvent) => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  href?: string
  target?: string
  rel?: string
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", className = "", type = "button", ...props }, ref) => {
    
    const combinedClasses = buttonVariants({ variant, size, className })

    if (props.href) {
      const isExternal = props.href.startsWith("http")
      const Component = isExternal ? "a" : Link

      return (
        <Component
          href={props.href}
          target={props.target}
          rel={props.rel || (isExternal ? "noopener noreferrer" : undefined)}
          className={combinedClasses}
          ref={ref as any}
          // Pass through onClick even if it's a link
          onClick={props.onClick}
        >
          {children}
        </Component>
      )
    }

    return (
      <button 
        type={type} 
        className={combinedClasses} 
        ref={ref as any} 
        {...props}
      >
        {children}
      </button>
    )
  },
)

Button.displayName = "Button"

export default Button