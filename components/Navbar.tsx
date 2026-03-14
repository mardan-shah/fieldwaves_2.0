"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Container from "./ui/Container"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Logo from "./Logo"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "/philosophy", label: "PHILOSOPHY" },
    { href: "/projects", label: "PROJECTS" },
    { href: "/team", label: "UNIT" },
    { href: "/about", label: "ABOUT" },
    { href: "/services", label: "SERVICES" },
    { href: "/cases", label: "CASES" },
    { href: "/blog", label: "BLOG" },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-white/5 py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className=" mx-auto flex justify-between items-center px-6">
          
          {/* LOGO: Clean, Static, High Contrast */}
          <Logo setIsOpen={setIsOpen} />

          {/* DESKTOP NAV: Grouped and Spaced */}
          <div className="hidden lg:flex items-center gap-1 pointer-events-auto">
            <div className="flex items-center gap-1 mr-6 border-r border-white/10 pr-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <div className={cn(
                    "px-4 py-2 text-[10px] font-bold tracking-[0.2em] transition-all duration-200 uppercase",
                    isActive(link.href) 
                      ? "text-primary underline underline-offset-8 decoration-2" 
                      : "text-muted-foreground hover:text-white"
                  )}>
                    {link.label}
                  </div>
                </Link>
              ))}
            </div>

            {/* HIGH-IMPACT CTA */}
            <Link href="/contact">
              <Container
                variant="primary"
                className="px-8 py-2 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-primary/20"
                hoverEffect
              >
                <span className="font-black text-xs tracking-[0.2em] block">CONTACT</span>
              </Container>
            </Link>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="lg:hidden pointer-events-auto">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-primary">
              {isOpen ? <X size={32} /> : <Menu size={32} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY: Fullscreen Brutalist */}
      <div className={cn(
        "fixed inset-0 z-40 bg-background/98 transition-all duration-500 ease-in-out flex flex-col justify-center px-6",
        isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}>
        <div className="flex flex-col gap-4 text-center">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className="text-2xl font-black tracking-tighter hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/contact" onClick={() => setIsOpen(false)} className="mt-8 w-50 mx-auto">
            <Container variant="primary" className="py-3 w-full">
              <span className="text-lg font-black">CONTACT US</span>
            </Container>
          </Link>
        </div>
      </div>
    </>
  )
}

export default Navbar