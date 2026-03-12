"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import SkewContainer from "@/components/ui/SkewContainer"
import FormInput from "@/components/ui/FormInput"
import { createAdmin, verifyAdmin } from "@/app/actions/admin"
import { Terminal, Lock, Loader2 } from "lucide-react"

interface AdminLoginFormProps {
  needsSetup: boolean
}

export default function AdminLoginForm({ needsSetup }: AdminLoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    try {
      const result = needsSetup
        ? await createAdmin(formData)
        : await verifyAdmin(formData)

      if (result.error) throw new Error(result.error)

      // Session cookie is set server-side, just refresh
      router.refresh()
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SkewContainer variant="outline" className="w-full max-w-md p-10 bg-card">
        <div className="mb-8 text-center">
          <Terminal size={48} className="mx-auto text-primary mb-4" />
          <h1 className="font-display text-3xl font-bold">
            {needsSetup ? "SYSTEM_INIT" : "SECURE_GATE"}
          </h1>
          <p className="font-mono text-xs text-secondary">
            {needsSetup ? "CREATE ROOT CREDENTIALS" : "RESTRICTED ACCESS ONLY"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <FormInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="ADMIN_EMAIL"
            placeholder="admin@fieldwaves.io"
            required
          />

          <FormInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label={needsSetup ? "SET_PASSWORD" : "PASSWORD"}
            placeholder="••••••••"
            required
          />

          {needsSetup && (
            <p className="text-xs text-muted font-mono">
              Must include uppercase, lowercase, number, and special character
            </p>
          )}

          {authError && (
            <div className="p-3 bg-red-900/20 border border-red-500 text-red-500 text-xs font-mono">
              ERROR: {authError}
            </div>
          )}

          <button type="submit" disabled={isSubmitting} className="w-full group">
            <SkewContainer
              variant="primary"
              className="py-3 text-center flex items-center justify-center gap-2 skew-x-0"
              hoverEffect
            >
              <div className="flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Lock size={16} />
                )}
                <span className="font-bold tracking-widest">
                  {needsSetup ? "INITIALIZE_SYSTEM" : "AUTHENTICATE"}
                </span>
              </div>
            </SkewContainer>
          </button>
        </form>
      </SkewContainer>
    </div>
  )
}
