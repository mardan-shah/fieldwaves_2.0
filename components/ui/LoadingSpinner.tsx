import type React from "react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  }

  return (
    <div className={`inline-block ${sizes[size]} ${className}`}>
      <div
        className={`w-full h-full border-[#FF5F1F] border-t-transparent border-solid rounded-full animate-spin`}
        style={{
          borderTopColor: "transparent",
          borderRightColor: "#FF5F1F",
          borderBottomColor: "transparent",
          borderLeftColor: "#FF5F1F",
        }}
      />
    </div>
  )
}

export default LoadingSpinner
