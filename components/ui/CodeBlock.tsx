"use client"

import type React from "react"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface CodeBlockProps {
  code: string
  language?: string
  className?: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = "js", className = "" }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`bg-[#0a0a0a] border border-[#333] rounded overflow-hidden ${className}`}>
      <div className="flex justify-between items-center px-4 py-3 border-b border-[#333] bg-[#141414]">
        <span className="font-mono text-xs text-[#B0B0B0]">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 font-mono text-xs text-[#B0B0B0] hover:text-[#FF5F1F] transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? "COPIED" : "COPY"}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-sm text-[#B0B0B0]">{code}</code>
      </pre>
    </div>
  )
}

export default CodeBlock
