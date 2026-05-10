"use client";

import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsPanel } from "@/components/ask/SettingsPanel";
import type { RagConfig } from "@/types/rag";

interface SidebarProps {
  isOpen: boolean;
  config: RagConfig;
  onConfigChange: (config: RagConfig) => void;
  onClearChat: () => void;
}

export function Sidebar({ isOpen, config, onConfigChange, onClearChat }: SidebarProps) {
  return (
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

          {/* RAG Settings */}
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

          {/* New Chat */}
          <section>
            <p className="mb-3 text-xs text-muted-foreground leading-relaxed">
              Start a fresh conversation. Your current chat will be cleared.
            </p>
            <Button
              variant="secondary"
              className="w-full gap-2 rounded-xl"
              onClick={onClearChat}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New Chat
            </Button>
          </section>

        </div>
      </aside>
    </div>
  );
}
