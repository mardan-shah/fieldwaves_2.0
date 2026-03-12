"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function MaintenanceGuard({ enabled }: { enabled: boolean }) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (enabled && pathname !== "/maintenance") {
      router.replace("/maintenance")
    } else if (!enabled && pathname === "/maintenance") {
      router.replace("/")
    }
  }, [enabled, pathname, router])

  return null
}
