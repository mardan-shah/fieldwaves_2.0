"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import SkewContainer from "./ui/SkewContainer"
import { Shield, Menu, X } from "lucide-react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/philosophy", label: "01_PHILOSOPHY" },
    { href: "/projects", label: "02_PROJECTS" },
    { href: "/team", label: "03_UNIT" },
    { href: "/about", label: "04_ABOUT" },
    { href: "/services", label: "05_SERVICES" },
    { href: "/cases", label: "06_CASES" },
    { href: "/contact", label: "07_CONTACT" },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#141414]/90 backdrop-blur-md border-b border-[#333] py-4 pointer-events-auto"
            : "bg-transparent py-6 pointer-events-none"
        }`}
      >
        <div className="max-w-8xl mx-auto flex justify-between items-start px-6">
          {/* Logo Area */}
          <div className="pointer-events-auto relative z-50">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <SkewContainer
                variant="primary"
                className="px-6 py-2 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center gap-3">
                  <Shield size={24} strokeWidth={2.5} />
                  <span className="font-display font-bold text-xl tracking-wider">FIELDWAVES</span>
                </div>
              </SkewContainer>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4 pointer-events-auto">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="group">
                <SkewContainer variant="ghost" className="px-5 py-2" hoverEffect>
                  <span className="font-mono text-sm tracking-widest font-bold">{link.label}</span>
                </SkewContainer>
              </Link>
            ))}
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden pointer-events-auto relative z-50">
            <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
              <SkewContainer variant={isOpen ? "primary" : "glass"} className="p-2">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </SkewContainer>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-[#141414] flex flex-col items-center justify-start pt-32 pb-10 overflow-y-auto pointer-events-auto">
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none"
               style={{
                 backgroundImage: "linear-gradient(#B0B0B0 1px, transparent 1px), linear-gradient(90deg, #B0B0B0 1px, transparent 1px)",
                 backgroundSize: "40px 40px",
               }}
          />
          <div className="flex flex-col gap-6 relative z-10 w-full max-w-xs">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className="w-full block">
                <SkewContainer variant="ghost" className="w-full py-4 text-center" hoverEffect>
                  <span className="font-mono text-xl tracking-widest font-bold">{link.label}</span>
                </SkewContainer>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
