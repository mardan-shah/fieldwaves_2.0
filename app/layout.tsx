import type React from "react"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Geist, Geist_Mono } from "next/font/google"
import { Suspense } from "react"
import ErrorBoundary from "../components/ErrorBoundary"
import ScrollToTop from "../components/ScrollToTop"
import { Toaster } from "sonner"
import AdSenseScript from "@/components/ads/AdSenseScript"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

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
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-N9W6MQTJ7C" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-N9W6MQTJ7C');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <Suspense fallback={null}>
            {children}
          </Suspense>
          <ScrollToTop />
          <AdSenseScript />
          <Toaster position="top-right" theme="dark" richColors />
        </ErrorBoundary>
      </body>
    </html>
  )
}
