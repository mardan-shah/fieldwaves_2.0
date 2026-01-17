import type React from "react"

interface SectionHeadingProps {
  label?: string
  title: string
  subtitle?: string
  align?: "left" | "center" | "right"
  className?: string
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ label, title, subtitle, align = "left", className = "" }) => {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }

  return (
    <div className={`${alignClasses[align]} ${className}`}>
      {label && (
        <div
          className="flex items-center gap-4 mb-6"
          style={{ justifyContent: align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start" }}
        >
          <div className="w-12 h-1 bg-[#FF5F1F] transform -skew-x-12"></div>
          <p className="font-mono text-xs text-[#FF5F1F] tracking-widest uppercase">{label}</p>
        </div>
      )}
      <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight mb-4">{title}</h2>
      {subtitle && (
        <p className="text-lg text-[#B0B0B0] max-w-2xl" style={{ margin: align === "center" ? "0 auto" : "0" }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeading
