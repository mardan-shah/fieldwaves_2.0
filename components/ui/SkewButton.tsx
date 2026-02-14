"use client"

import React from "react"
import Link from "next/link"
import SkewContainer from "./SkewContainer"

interface ButtonProps {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  className?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  href?: string
  target?: string
  rel?: string
}

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ children, variant = "primary", size = "md", className = "", type = "button", ...props }, ref) => {
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    }

    if (props.href) {
      const isExternal = props.href.startsWith("http")
      const Component = isExternal ? "a" : Link

      return (
        <Component
          href={props.href}
          target={props.target}
          rel={props.rel}
          className={`inline-block ${className}`}
          ref={ref as any}
        >
          <SkewContainer variant={variant} className={sizeClasses[size]} hoverEffect>
            <span className="font-bold tracking-wider">{children}</span>
          </SkewContainer>
        </Component>
      )
    }

    return (
      <button type={type} className={`${className}`} ref={ref as any} {...props}>
        <SkewContainer variant={variant} className={sizeClasses[size]} hoverEffect>
          <span className="font-bold tracking-wider">{children}</span>
        </SkewContainer>
      </button>
    )
  },
)

Button.displayName = "Button"

export default Button
