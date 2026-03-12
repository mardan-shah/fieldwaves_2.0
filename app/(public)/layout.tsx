import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Suspense } from "react"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden selection:bg-primary selection:text-white">
      <Navbar />
      <Suspense fallback={null}>
        {children}
      </Suspense>
      <Footer />
    </div>
  )
}
