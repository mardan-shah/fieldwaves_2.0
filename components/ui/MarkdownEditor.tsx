"use client"

import { useState } from "react"
import FormTextarea from "./FormTextarea"
import MarkdownRenderer from "./MarkdownRenderer"

interface MarkdownEditorProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
  placeholder?: string
  error?: string
}

export default function MarkdownEditor({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  error,
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <label className="font-mono text-xs text-secondary tracking-widest">{label}</label>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={`px-3 py-1 font-mono text-[10px] tracking-wider transition-colors ${
              activeTab === "write"
                ? "bg-primary text-white"
                : "bg-input text-muted hover:text-secondary border border-border"
            }`}
          >
            WRITE
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 font-mono text-[10px] tracking-wider transition-colors ${
              activeTab === "preview"
                ? "bg-primary text-white"
                : "bg-input text-muted hover:text-secondary border border-border"
            }`}
          >
            PREVIEW
          </button>
        </div>
      </div>

      {activeTab === "write" ? (
        <div>
          <FormTextarea
            label=""
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            error={error}
          />
          <p className="text-[10px] font-mono text-muted mt-1">
            SUPPORTS MARKDOWN: **bold**, *italic*, ## headings, - lists, [links](url), `code`, &gt; quotes
          </p>
        </div>
      ) : (
        <div className="border border-border bg-input p-4 min-h-[100px] max-h-[300px] overflow-y-auto">
          <MarkdownRenderer content={value} />
        </div>
      )}
    </div>
  )
}
