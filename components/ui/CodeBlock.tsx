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
    <div className={`bg-input border border-border rounded overflow-hidden ${className}`}>
      <div className="flex justify-between items-center px-4 py-3 border-b border-border bg-card">
        <span className="font-mono text-xs text-secondary">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 font-mono text-xs text-secondary hover:text-primary transition-colors"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? "COPIED" : "COPY"}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="font-mono text-sm text-secondary">{code}</code>
      </pre>
    </div>
  )
}

export default CodeBlock
