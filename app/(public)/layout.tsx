import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Suspense } from "react"
import { getSettings } from "@/app/actions/public"
import { headers } from "next/headers"
import MaintenanceGuard from "@/components/MaintenanceGuard"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()
  const headerList = await headers()
  const pathname = headerList.get("x-pathname") || ""
  const isMaintenancePage = pathname === "/maintenance"

  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden selection:bg-primary selection:text-white">
      <MaintenanceGuard enabled={!!settings?.maintenanceMode} />
      {!isMaintenancePage && <Navbar />}
      <Suspense fallback={null}>
        {children}
      </Suspense>
      {!isMaintenancePage && <Footer />}
    </div>
  )
}
