"use client"
import Link from "next/link"
import SkewContainer from "./ui/SkewContainer"
import { Shield } from "lucide-react"

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-between items-start">
        {/* Logo Area */}
        <div className="pointer-events-auto">
          <Link href="/">
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
          <Link href="/philosophy" className="group">
            <SkewContainer variant="ghost" className="px-5 py-2" hoverEffect>
              <span className="font-mono text-sm tracking-widest font-bold">01_PHILOSOPHY</span>
            </SkewContainer>
          </Link>

          <Link href="/projects" className="group">
            <SkewContainer variant="ghost" className="px-5 py-2" hoverEffect>
              <span className="font-mono text-sm tracking-widest font-bold">02_PROJECTS</span>
            </SkewContainer>
          </Link>

          <Link href="/team" className="group">
            <SkewContainer variant="ghost" className="px-5 py-2" hoverEffect>
              <span className="font-mono text-sm tracking-widest font-bold">03_UNIT</span>
            </SkewContainer>
          </Link>

          <Link href="/about" className="group">
            <SkewContainer variant="ghost" className="px-5 py-2" hoverEffect>
              <span className="font-mono text-sm tracking-widest font-bold">04_ABOUT</span>
            </SkewContainer>
          </Link>

          <Link href="/services" className="group">
            <SkewContainer variant="ghost" className="px-5 py-2" hoverEffect>
              <span className="font-mono text-sm tracking-widest font-bold">05_SERVICES</span>
            </SkewContainer>
          </Link>

          <Link href="/cases" className="group">
            <SkewContainer variant="ghost" className="px-5 py-2" hoverEffect>
              <span className="font-mono text-sm tracking-widest font-bold">06_CASES</span>
            </SkewContainer>
          </Link>

          <Link href="/contact" className="group">
            <SkewContainer variant="ghost" className="px-5 py-2" hoverEffect>
              <span className="font-mono text-sm tracking-widest font-bold">07_CONTACT</span>
            </SkewContainer>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
