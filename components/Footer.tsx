import Link from "next/link"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"
import SkewContainer from "./ui/SkewContainer"

const Footer = () => {
  return (
    <footer className="bg-surface border-t-2 border-primary mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="-skew-x-12 flex items-stretch mb-6 inline-flex">
              <div className="bg-primary px-2.5 py-1.5 flex items-center">
                <span className="font-display font-black text-lg text-background tracking-tight">FW</span>
              </div>
              <div className="border-2 border-primary border-l-0 px-2.5 py-1.5 flex items-center">
                <span className="font-mono font-bold text-[10px] text-primary tracking-[0.2em]">FIELDWAVES</span>
              </div>
            </div>
            <p className="font-mono text-xs text-secondary tracking-widest">ENGINEERED AESTHETICS</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-mono text-xs text-primary tracking-widest font-bold mb-4 uppercase">CORE_MODULES</h3>
            <ul className="space-y-2 font-mono text-sm text-secondary">
              <li>
                <Link href="/services" className="hover:text-primary transition-colors">
                  01_Services
                </Link>
              </li>
              <li>
                <Link href="/cases" className="hover:text-primary transition-colors">
                  02_Case_Studies
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-primary transition-colors">
                  03_Deployments
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-mono text-xs text-primary tracking-widest font-bold mb-4 uppercase">INTEL_FEED</h3>
            <ul className="space-y-2 font-mono text-sm text-secondary">
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors">
                  04_Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  05_About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  06_Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-mono text-xs text-primary tracking-widest font-bold mb-4 uppercase">COMMAND_CENTER</h3>
            <div className="flex gap-3 -skew-x-12">
              <a
                href="#"
                className="p-2 border border-border hover:border-primary hover:text-primary transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="p-2 border border-border hover:border-primary hover:text-primary transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="p-2 border border-border hover:border-primary hover:text-primary transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="p-2 border border-border hover:border-primary hover:text-primary transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-muted">© 2026 FieldWaves. All rights reserved.</p>
          <div className="flex gap-6 font-mono text-xs text-secondary">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
