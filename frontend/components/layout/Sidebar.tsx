"use client";

import { cn } from "@/lib/utils";
import { SlidersHorizontal, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsPanel } from "@/components/ask/SettingsPanel";
import { QueryHistory } from "@/components/ask/QueryHistory";
import type { RagConfig, HistoryEntry } from "@/types/rag";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  config: RagConfig;
  onConfigChange: (config: RagConfig) => void;
  history: HistoryEntry[];
  onSelectHistory: (entry: HistoryEntry) => void;
}

export function Sidebar({
  isOpen,
  onClose,
  config,
  onConfigChange,
  history,
  onSelectHistory,
}: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <aside
        className={cn(
          "fixed right-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-72 overflow-y-auto",
          "glass border-l transition-transform duration-300 ease-in-out",
          "md:sticky md:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}
        style={{ borderColor: "var(--glass-border)" }}
        aria-label="Settings panel"
      >
        <div className="flex flex-col gap-6 p-5">

          {/* Mobile header */}
          <div className="flex items-center justify-between md:hidden">
            <span className="text-sm font-semibold text-foreground">Settings</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7"
              aria-label="Close settings"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

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
    </>
  );
}
