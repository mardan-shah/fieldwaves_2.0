"use client"

import type React from "react"

import { Terminal, LogOut } from "lucide-react"

interface AdminHeaderProps {
  onLogout?: () => void
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  return (
    <div className="mb-12 pb-8 border-b border-[#333]">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Terminal className="text-[#FF5F1F]" size={32} />
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold">COMMAND_CENTER</h1>
              <p className="font-mono text-xs text-[#B0B0B0] tracking-widest mt-1">ADMIN_MODE: ACTIVE</p>
            </div>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 font-mono text-xs text-[#B0B0B0] hover:text-[#FF5F1F] transition-colors"
          >
            <LogOut size={16} />
            <span>LOGOUT</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default AdminHeader
