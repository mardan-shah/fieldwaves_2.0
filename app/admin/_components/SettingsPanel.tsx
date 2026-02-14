"use client"

import SkewContainer from "@/components/ui/SkewContainer"
import type { GlobalSettings, TeamMember, Project } from "@/types"
import { Power, Crown } from "lucide-react"

interface SettingsPanelProps {
  settings: GlobalSettings
  projects: Project[]
  team: TeamMember[]
  onToggleSoloMode: () => void
}

export default function SettingsPanel({ settings, projects, team, onToggleSoloMode }: SettingsPanelProps) {
  const owner = team.find(m => m.isOwner)

  return (
    <div className="space-y-8">
      {/* Global Config */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Power className="text-[#FF5F1F]" />
          <h2 className="font-mono font-bold text-lg tracking-wider">GLOBAL_CONFIG</h2>
        </div>

        <SkewContainer variant="glass" className="p-6 border-t-4 border-t-[#FF5F1F]">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-sm">SOLO MODE</h3>
                  <p className="text-xs text-[#B0B0B0] max-w-xs">Filter team to owner only.</p>
                </div>
                <button
                  onClick={onToggleSoloMode}
                  className={`relative w-14 h-7 transition-colors duration-300 shrink-0 ${
                    settings.soloMode ? "bg-[#FF5F1F]" : "bg-[#333]"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white transition-transform duration-300 ${
                      settings.soloMode ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-[#666]">Status: {settings.soloMode ? "ACTIVE" : "INACTIVE"}</p>
            </div>
          </div>
        </SkewContainer>
      </section>

      {/* Quick Stats */}
      <section>
        <h2 className="font-mono font-bold text-lg tracking-wider mb-6">SYSTEM_STATS</h2>
        <div className="space-y-3">
          <SkewContainer variant="glass" className="p-4 text-center">
            <p className="font-mono text-xs text-[#B0B0B0] mb-1">PROJECTS</p>
            <p className="font-display text-2xl font-bold">{projects.length}</p>
          </SkewContainer>
          <SkewContainer variant="glass" className="p-4 text-center">
            <p className="font-mono text-xs text-[#B0B0B0] mb-1">TEAM MEMBERS</p>
            <p className="font-display text-2xl font-bold">{team.length}</p>
          </SkewContainer>
          <SkewContainer variant="glass" className="p-4 text-center">
            <p className="font-mono text-xs text-[#B0B0B0] mb-1">MODE</p>
            <p className="font-mono text-sm text-[#FF5F1F]">{settings.soloMode ? "SOLO" : "PUBLIC"}</p>
          </SkewContainer>
          {owner && (
            <SkewContainer variant="glass" className="p-4">
              <p className="font-mono text-xs text-[#B0B0B0] mb-1">OWNER</p>
              <div className="flex items-center gap-2">
                <Crown size={14} className="text-[#FF5F1F]" />
                <p className="font-mono text-sm text-white">{owner.name}</p>
              </div>
            </SkewContainer>
          )}
        </div>
      </section>
    </div>
  )
}
