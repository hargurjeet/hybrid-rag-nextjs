"use client";

import { SlidersHorizontal, Clock } from "lucide-react";
import { SettingsPanel } from "@/components/ask/SettingsPanel";
import { QueryHistory } from "@/components/ask/QueryHistory";
import type { RagConfig, HistoryEntry } from "@/types/rag";

interface SidebarProps {
  isOpen: boolean;
  config: RagConfig;
  onConfigChange: (config: RagConfig) => void;
  history: HistoryEntry[];
  onSelectHistory: (entry: HistoryEntry) => void;
}

export function Sidebar({
  isOpen,
  config,
  onConfigChange,
  history,
  onSelectHistory,
}: SidebarProps) {
  return (
    /*
     * Clip wrapper — animates width so the panel slides in/out as an inline
     * flex child. No fixed positioning, no backdrop, no blur on the content behind.
     */
    <div
      className="shrink-0 overflow-hidden"
      style={{
        width: isOpen ? "288px" : "0",
        transition: "width 300ms ease-in-out",
      }}
    >
      <aside
        className="w-72 h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto border-l"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(var(--glass-blur))",
          WebkitBackdropFilter: "blur(var(--glass-blur))",
          borderColor: "var(--glass-border)",
        }}
        aria-label="Settings panel"
      >
        <div className="flex flex-col gap-6 p-5">

          {/* Settings */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Settings
              </span>
            </div>
            <SettingsPanel config={config} onChange={onConfigChange} />
          </section>

          {/* Divider */}
          <div className="h-px w-full" style={{ background: "var(--border)" }} />

          {/* Query history */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Recent Queries
              </span>
            </div>
            <QueryHistory history={history} onSelect={onSelectHistory} />
          </section>

        </div>
      </aside>
    </div>
  );
}
