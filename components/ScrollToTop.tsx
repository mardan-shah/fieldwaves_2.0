"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return isVisible ? (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 p-3 bg-[#FF5F1F] text-white hover:bg-[#FF5F1F]/80 transition-all transform -skew-x-12 z-40"
      aria-label="Scroll to top"
    >
      <div className="transform skew-x-12">
        <ArrowUp size={20} />
      </div>
    </button>
  ) : null
}

export default ScrollToTop
