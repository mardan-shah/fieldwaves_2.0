import type React from "react"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <div className="group">
      <label className="block font-mono text-xs text-secondary mb-2 tracking-widest">{label}</label>
      <div className="relative transform  border border-border bg-input transition-colors group-focus-within:border-primary">
        <input
          {...props}
          className="w-full h-full bg-transparent text-white p-3.5 outline-none transform placeholder:text-muted"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
