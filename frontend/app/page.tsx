"use client";

import { useState, useCallback } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { TabNav, type ActiveTab } from "@/components/layout/TabNav";
import { SampleQuestions } from "@/components/ask/SampleQuestions";
import { ChatThread } from "@/components/ask/ChatThread";
import { ChatInput } from "@/components/ask/ChatInput";
import { OnboardingCard } from "@/components/ask/OnboardingCard";
import { PaperFilterBar } from "@/components/ask/PaperFilterBar";
import { queryRAG } from "@/lib/api";
import { DEFAULT_CONFIG, type RagConfig, type ChatMessage, type PaperSummary, type ChatSession } from "@/types/rag";
import { AlertCircle } from "lucide-react";
import { EvaluationView } from "@/components/evaluation/EvaluationView";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function sessionTitle(messages: ChatMessage[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "Untitled chat";
  const t = first.content.trim();
  return t.length > 45 ? t.slice(0, 42) + "…" : t;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("ask");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState("");
  const [config, setConfig] = useState<RagConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPapers, setSelectedPapers] = useState<PaperSummary[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  const handleSubmit = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    // Snapshot history before adding the new user message
    const historyForApi = messages.map((m) => ({ role: m.role, content: m.content }));

    // Append user message immediately so the UI feels responsive
    setMessages((prev) => [...prev, { id: uid(), role: "user", content: trimmed }]);
    setQuery("");
    setIsLoading(true);
    setError(null);

    try {
      const data = await queryRAG({
        query: trimmed,
        top_k: config.top_k,
        alpha: config.alpha,
        use_hybrid: config.use_hybrid,
        chat_history: historyForApi,
        paper_ids: selectedPapers.length > 0 ? selectedPapers.map((p) => p.paper_id) : undefined,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: uid(),
          role: "assistant",
          content: data.answer,
          documents: data.documents,
          latency_ms: data.latency_ms,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [query, config, isLoading, messages]);

  const handleSelectSample = useCallback((q: string) => {
    setQuery(q);
    setError(null);
  }, []);

  const handleNewChat = useCallback(() => {
    if (messages.length > 0) {
      setSessions((prev) => [
        { id: uid(), title: sessionTitle(messages), messages, selectedPapers, savedAt: new Date() },
        ...prev,
      ]);
    }
    setMessages([]);
    setQuery("");
    setError(null);
    setSelectedPapers([]);
  }, [messages, selectedPapers]);

  const handleRestoreSession = useCallback(
    (session: ChatSession) => {
      // Save the current conversation before switching (if non-empty)
      if (messages.length > 0) {
        setSessions((prev) => {
          const withoutTarget = prev.filter((s) => s.id !== session.id);
          const current: ChatSession = {
            id: uid(),
            title: sessionTitle(messages),
            messages,
            selectedPapers,
            savedAt: new Date(),
          };
          return [current, ...withoutTarget];
        });
      } else {
        setSessions((prev) => prev.filter((s) => s.id !== session.id));
      }
      setMessages(session.messages);
      setSelectedPapers(session.selectedPapers);
      setQuery("");
      setError(null);
      setSidebarOpen(false);
    },
    [messages, selectedPapers],
  );

  return (
    <div className="flex h-screen flex-col bg-background">
      <NavBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main */}
        <main className="flex flex-1 flex-col overflow-hidden" style={{ minWidth: 0 }}>
          {/* Tab bar */}
          <div
            className="shrink-0 border-b px-4 py-3 sm:px-6"
            style={{ borderColor: "var(--border)" }}
          >
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "ask" ? (
              <AskView
                messages={messages}
                query={query}
                onQueryChange={setQuery}
                onSubmit={handleSubmit}
                onSelectSample={handleSelectSample}
                isLoading={isLoading}
                error={error}
                selectedPapers={selectedPapers}
                onSelectedPapersChange={setSelectedPapers}
              />
            ) : (
              <div className="h-full overflow-y-auto px-4 py-6 sm:px-6">
                <EvaluationView />
              </div>
            )}
          </div>
        </main>

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          config={config}
          onConfigChange={setConfig}
          onNewChat={handleNewChat}
          sessions={sessions}
          onRestoreSession={handleRestoreSession}
        />
      </div>
    </div>
  );
}

/* ── Ask / Chat view ────────────────────────────────────────────────────────── */

interface AskViewProps {
  messages: ChatMessage[];
  query: string;
  onQueryChange: (v: string) => void;
  onSubmit: () => void;
  onSelectSample: (q: string) => void;
  isLoading: boolean;
  error: string | null;
  selectedPapers: PaperSummary[];
  onSelectedPapersChange: (papers: PaperSummary[]) => void;
}

function AskView({
  messages,
  query,
  onQueryChange,
  onSubmit,
  onSelectSample,
  isLoading,
  error,
  selectedPapers,
  onSelectedPapersChange,
}: AskViewProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Thread or empty state — scrollable region */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-2 sm:px-6">
        {messages.length === 0 ? (
          <div className="space-y-6">
            <OnboardingCard />
            <SampleQuestions onSelect={onSelectSample} disabled={isLoading} />
          </div>
        ) : (
          <ChatThread messages={messages} isLoading={isLoading} />
        )}
      </div>

      {/* Paper filter bar */}
      <PaperFilterBar
        selectedPapers={selectedPapers}
        onSelectedPapersChange={onSelectedPapersChange}
        disabled={isLoading}
      />

      {/* Error banner */}
      {error && (
        <div className="shrink-0 px-4 pb-2 sm:px-6">
          <ErrorCard message={error} />
        </div>
      )}

      {/* Input — always pinned to bottom */}
      <div
        className="shrink-0 border-t px-4 py-4 sm:px-6"
        style={{ borderColor: "var(--border)" }}
      >
        <ChatInput
          query={query}
          onChange={onQueryChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
          hasMessages={messages.length > 0}
        />
      </div>
    </div>
  );
}

/* ── Supporting UI pieces ───────────────────────────────────────────────────── */

function ErrorCard({ message }: { message: string }) {
  return (
    <div
      className="flex items-start gap-3 rounded-xl border p-4 animate-fade-in"
      style={{
        borderColor: "var(--apple-red)",
        background: "color-mix(in srgb, var(--apple-red) 8%, transparent)",
      }}
    >
      <AlertCircle
        className="mt-0.5 h-4 w-4 shrink-0"
        style={{ color: "var(--apple-red)" }}
      />
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--apple-red)" }}>
          Request failed
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">{message}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Make sure the backend is running:{" "}
          <code className="font-mono">uv run uvicorn api.main:app --port 8000</code>
        </p>
      </div>
    </div>
  );
}
