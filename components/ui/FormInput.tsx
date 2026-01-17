import type React from "react"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <div>
      <label className="block font-mono text-xs text-[#B0B0B0] mb-2 tracking-widest">{label}</label>
      <input
        {...props}
        className="w-full bg-[#0a0a0a] border border-[#333] text-white p-3.5 focus:border-[#FF5F1F] focus:ring-1 focus:ring-[#FF5F1F]/20 outline-none transition-all placeholder:text-[#666]"
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
