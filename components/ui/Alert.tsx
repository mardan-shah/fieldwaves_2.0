"use client"

import type React from "react"
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from "lucide-react"
import { useState } from "react"

type AlertType = "info" | "success" | "warning" | "error"

interface AlertProps {
  type?: AlertType
  title: string
  message: string
  dismissible?: boolean
  className?: string
}

const Alert: React.FC<AlertProps> = ({ type = "info", title, message, dismissible = true, className = "" }) => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const config = {
    info: {
      bg: "bg-blue-900/20",
      border: "border-blue-500",
      text: "text-blue-500",
      icon: Info,
    },
    success: {
      bg: "bg-green-900/20",
      border: "border-green-500",
      text: "text-green-500",
      icon: CheckCircle,
    },
    warning: {
      bg: "bg-yellow-900/20",
      border: "border-yellow-500",
      text: "text-yellow-500",
      icon: AlertTriangle,
    },
    error: {
      bg: "bg-red-900/20",
      border: "border-red-500",
      text: "text-red-500",
      icon: AlertCircle,
    },
  }

  const { bg, border, text, icon: Icon } = config[type]

  return (
    <div className={`${bg} border ${border} ${text} p-4 rounded flex items-start gap-3 ${className}`}>
      <Icon size={20} className="shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-bold text-sm mb-1">{title}</h3>
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {dismissible && (
        <button onClick={() => setDismissed(true)} className="shrink-0 hover:opacity-70 transition-opacity">
          <X size={16} />
        </button>
      )}
    </div>
  )
}

export default Alert
