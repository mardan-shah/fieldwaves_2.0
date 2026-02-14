import { Github, Linkedin, Twitter, Mail } from "lucide-react"
import SkewContainer from "./ui/SkewContainer"

const Footer = () => {
  return (
    <footer className="bg-[#0f0f0f] border-t-2 border-[#FF5F1F] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <SkewContainer variant="primary" className="px-4 py-2 inline-block mb-6">
              <span className="font-display font-bold text-lg">FW</span>
            </SkewContainer>
            <p className="font-mono text-xs text-[#B0B0B0] tracking-widest">ENGINEERING OVER VIBE</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-mono text-xs text-[#FF5F1F] tracking-widest font-bold mb-4">PRODUCT</h3>
            <ul className="space-y-2 font-mono text-sm text-[#B0B0B0]">
              <li>
                <a href="#services" className="hover:text-[#FF5F1F] transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#cases" className="hover:text-[#FF5F1F] transition-colors">
                  Case Studies
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-[#FF5F1F] transition-colors">
                  Deployments
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-mono text-xs text-[#FF5F1F] tracking-widest font-bold mb-4">RESOURCES</h3>
            <ul className="space-y-2 font-mono text-sm text-[#B0B0B0]">
              <li>
                <a href="#" className="hover:text-[#FF5F1F] transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF5F1F] transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF5F1F] transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-mono text-xs text-[#FF5F1F] tracking-widest font-bold mb-4">CONNECT</h3>
            <div className="flex gap-3 -skew-x-12">
              <a
                href="#"
                className="p-2 border border-[#333] hover:border-[#FF5F1F] hover:text-[#FF5F1F] transition-colors"
              >
                <Github size={18} />
              </a>
              <a
                href="#"
                className="p-2 border border-[#333] hover:border-[#FF5F1F] hover:text-[#FF5F1F] transition-colors"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="#"
                className="p-2 border border-[#333] hover:border-[#FF5F1F] hover:text-[#FF5F1F] transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="p-2 border border-[#333] hover:border-[#FF5F1F] hover:text-[#FF5F1F] transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#333] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-[#666]">© 2025 FieldWaves. All rights reserved.</p>
          <div className="flex gap-6 font-mono text-xs text-[#B0B0B0]">
            <a href="#" className="hover:text-[#FF5F1F] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#FF5F1F] transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-[#FF5F1F] transition-colors">
              Status
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
