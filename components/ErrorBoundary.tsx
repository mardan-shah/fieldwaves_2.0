"use client"

import type React from "react"
import { Component } from "react"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141414] border border-red-500 p-8 text-center">
            <h1 className="font-display text-3xl font-bold mb-4 text-red-500">ERROR_DETECTED</h1>
            <p className="text-[#B0B0B0] mb-6 font-mono text-sm">{this.state.error?.message || "An error occurred"}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#FF5F1F] text-white font-mono text-sm font-bold hover:bg-[#FF5F1F]/80 transition-colors"
            >
              RESTART_SYSTEM
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
