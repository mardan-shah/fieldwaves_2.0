import type React from "react"

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export default function FormTextarea({ label, error, ...props }: FormTextareaProps) {
  return (
    <div className="group">
      <label className="block font-mono text-xs text-secondary mb-2 tracking-widest">{label}</label>
      <div className="relative transform border border-border bg-input transition-colors group-focus-within:border-primary">
        <textarea
          {...props}
          className="w-full h-full bg-transparent text-white p-3.5 outline-none transform placeholder:text-muted resize-y"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
