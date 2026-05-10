"use client";

import { useState, useCallback } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { TabNav, type ActiveTab } from "@/components/layout/TabNav";
import { SampleQuestions } from "@/components/ask/SampleQuestions";
import { ChatThread } from "@/components/ask/ChatThread";
import { ChatInput } from "@/components/ask/ChatInput";
import { queryRAG } from "@/lib/api";
import { DEFAULT_CONFIG, type RagConfig, type ChatMessage } from "@/types/rag";
import { AlertCircle, FlaskConical } from "lucide-react";
import { EvaluationView } from "@/components/evaluation/EvaluationView";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("ask");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [query, setQuery] = useState("");
  const [config, setConfig] = useState<RagConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setQuery("");
    setError(null);
  }, []);

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
          onClearChat={handleClearChat}
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
}

function AskView({
  messages,
  query,
  onQueryChange,
  onSubmit,
  onSelectSample,
  isLoading,
  error,
}: AskViewProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Thread or empty state — scrollable region */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-2 sm:px-6">
        {messages.length === 0 ? (
          <div className="space-y-8">
            <SampleQuestions onSelect={onSelectSample} disabled={isLoading} />
            <EmptyState />
          </div>
        ) : (
          <ChatThread messages={messages} isLoading={isLoading} />
        )}
      </div>

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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: "var(--apple-surface-2)" }}
      >
        <FlaskConical className="h-7 w-7" style={{ color: "var(--apple-blue)" }} />
      </div>
      <div className="max-w-xs space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground">
          Ask a Research Question
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Search across 10,000 arXiv papers. Ask a follow-up after each answer
          to keep the conversation going.
        </p>
      </div>
    </div>
  );
}

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
