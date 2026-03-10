"use client"

import { useEffect, useRef } from "react"

interface AdUnitProps {
  slot: string
  format?: "auto" | "rectangle" | "horizontal" | "vertical"
  className?: string
}

/**
 * Google AdSense ad unit component.
 *
 * Prerequisites before enabling:
 * 1. Set NEXT_PUBLIC_ADSENSE_PUB_ID in .env.local (e.g. "ca-pub-XXXXXXXXXXXXXXXX")
 * 2. Create ad units in your AdSense dashboard and use their slot IDs
 * 3. Uncomment the AdSense script in app/layout.tsx
 *
 * Usage:
 *   <AdUnit slot="1234567890" format="auto" />
 *   <AdUnit slot="1234567890" format="rectangle" />
 *
 * Recommended placements for blog posts:
 *   - After the excerpt / before main content
 *   - Between TOC sidebar and content (sidebar ad)
 *   - After the main content / before CTA
 *   - In blog listing grid (every 3-4 cards)
 */
export default function AdUnit({ slot, format = "auto", className = "" }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null)
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID

  useEffect(() => {
    if (!pubId || !adRef.current) return

    try {
      // Push ad only if not already initialized
      if (!adRef.current.dataset.adsbygoogleStatus) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      }
    } catch {
      // AdSense may throw if blocked by ad blocker
    }
  }, [pubId])

  // Don't render anything if AdSense is not configured
  if (!pubId) return null

  const formatStyles: Record<string, React.CSSProperties> = {
    auto: { display: "block" },
    rectangle: { display: "inline-block", width: 300, height: 250 },
    horizontal: { display: "block", height: 90 },
    vertical: { display: "inline-block", width: 160, height: 600 },
  }

  return (
    <div className={`ad-container my-8 ${className}`}>
      <p className="font-mono text-[10px] text-muted tracking-widest mb-1 text-center">ADVERTISEMENT</p>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={formatStyles[format]}
        data-ad-client={pubId}
        data-ad-slot={slot}
        data-ad-format={format === "auto" ? "auto" : undefined}
        data-full-width-responsive={format === "auto" ? "true" : undefined}
      />
    </div>
  )
}
