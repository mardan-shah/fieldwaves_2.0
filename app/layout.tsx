import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import ErrorBoundary from "../components/ErrorBoundary"
import ScrollToTop from "../components/ScrollToTop"
import { Toaster } from "sonner"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export const metadata: Metadata = {
  title: "FieldWaves | Engineering Excellence",
  description: "Enterprise-grade full-stack development with security, performance, and scalability at the core.",
  keywords: "web development, enterprise software, security, performance, full-stack, Next.js, React, microservices",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ErrorBoundary>
          {children}
          <ScrollToTop />
          <Analytics />
          <Toaster position="top-right" theme="dark" richColors />
        </ErrorBoundary>
      </body>
    </html>
  )
}
