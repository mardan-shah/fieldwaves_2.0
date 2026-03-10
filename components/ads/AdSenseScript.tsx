"use client"

import Script from "next/script"

/**
 * Loads the Google AdSense script globally.
 * Only renders when NEXT_PUBLIC_ADSENSE_PUB_ID is set.
 *
 * Add this to app/layout.tsx when ready to activate:
 *   import AdSenseScript from "@/components/ads/AdSenseScript"
 *   // Then inside <body>:
 *   <AdSenseScript />
 */
export default function AdSenseScript() {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID

  if (!pubId) return null

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
