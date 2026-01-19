import type React from "react"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <div className="group">
      <label className="block font-mono text-xs text-[#B0B0B0] mb-2 tracking-widest">{label}</label>
      <div className="relative transform  border border-[#333] bg-[#0a0a0a] transition-colors group-focus-within:border-[#FF5F1F]">
        <input
          {...props}
          className="w-full h-full bg-transparent text-white p-3.5 outline-none transform placeholder:text-[#666]"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
