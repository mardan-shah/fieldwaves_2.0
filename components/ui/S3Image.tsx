"use client"

import React, { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import LoadingSpinner from "./LoadingSpinner"
import { AlertCircle } from "lucide-react"

interface S3ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | Blob
  fallbackSrc?: string
  aspectRatio?: "video" | "square" | "portrait" | "auto"
  showLoadingSpinner?: boolean
}

export default function S3Image({
  src,
  alt = "",
  className,
  fallbackSrc = "/placeholder.svg",
  aspectRatio = "auto",
  showLoadingSpinner = true,
  ...props
}: S3ImageProps) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading")
  const [currentSrc, setCurrentSrc] = useState<string | undefined>()
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    // Revoke previous object URL if exists
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }

    if (src) {
      setStatus("loading")
      if (src instanceof Blob) {
        const objectUrl = URL.createObjectURL(src)
        objectUrlRef.current = objectUrl
        setCurrentSrc(objectUrl)
      } else {
        setCurrentSrc(src)
      }
    } else {
      setStatus("error")
      setCurrentSrc(fallbackSrc)
    }
  }, [src, fallbackSrc])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }
    }
  }, [])

  const handleLoad = () => {
    setStatus("loaded")
  }

  const handleError = () => {
    if (status !== "error") {
      setStatus("error")
      setCurrentSrc(fallbackSrc)
    }
  }

  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    auto: "",
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted/20 group/s3image", aspectClasses[aspectRatio], className)}>
      {/* Loading State */}
      {status === "loading" && showLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px] z-10 transition-opacity duration-300">
          <LoadingSpinner size="sm" variant="primary" />
        </div>
      )}

      {/* Error / Placeholder View */}
      {status === "error" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-input border border-dashed border-border gap-2 z-0">
          <AlertCircle size={24} className="text-muted opacity-50" />
          <span className="text-[10px] font-mono text-muted uppercase tracking-tighter">IMAGE_NOT_FOUND</span>
        </div>
      )}

      {/* Actual Image */}
      <img
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-all duration-700",
          status === "loaded" ? "opacity-100 scale-100" : "opacity-0 scale-105",
          className
        )}
        loading="lazy"
        {...props}
      />
      
      {/* Subtle scanline overlay for industrial aesthetic */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] opacity-20 group-hover/s3image:opacity-10 transition-opacity" />
    </div>
  )
}
