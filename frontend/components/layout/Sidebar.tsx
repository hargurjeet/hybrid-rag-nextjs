"use client";

import { SlidersHorizontal, RotateCcw, History, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SettingsPanel } from "@/components/ask/SettingsPanel";
import type { RagConfig, ChatSession } from "@/types/rag";

interface SidebarProps {
  isOpen: boolean;
  config: RagConfig;
  onConfigChange: (config: RagConfig) => void;
  onNewChat: () => void;
  sessions: ChatSession[];
  onRestoreSession: (session: ChatSession) => void;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function Sidebar({
  isOpen,
  config,
  onConfigChange,
  onNewChat,
  sessions,
  onRestoreSession,
}: SidebarProps) {
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
        aria-label="Settings and history panel"
      >
        <div className="flex flex-col gap-6 p-5">

          {/* Chat History */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <History className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Chat History
              </span>
            </div>

            {sessions.length === 0 ? (
              <p className="text-xs text-muted-foreground leading-relaxed">
                No previous chats yet. Start a conversation and click &ldquo;New Chat&rdquo; to save it here.
              </p>
            ) : (
              <ul className="space-y-1">
                {sessions.map((session) => (
                  <li key={session.id}>
                    <button
                      onClick={() => onRestoreSession(session)}
                      className="flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-secondary"
                    >
                      <MessageSquare
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-foreground leading-snug">
                          {session.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span>{formatTime(session.savedAt)}</span>
                          {session.selectedPapers.length > 0 && (
                            <>
                              <span>·</span>
                              <span>
                                {session.selectedPapers.length} paper
                                {session.selectedPapers.length > 1 ? "s" : ""}
                              </span>
                            </>
                          )}
                          <span>·</span>
                          <span>
                            {session.messages.filter((m) => m.role === "user").length} Q
                          </span>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Divider */}
          <div className="h-px w-full" style={{ background: "var(--border)" }} />

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
              Save the current conversation to history and start fresh.
            </p>
            <Button
              variant="secondary"
              className="w-full gap-2 rounded-xl"
              onClick={onNewChat}
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
