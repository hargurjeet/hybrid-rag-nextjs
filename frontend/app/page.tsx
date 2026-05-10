"use client";

import { useState, useCallback } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { TabNav, type ActiveTab } from "@/components/layout/TabNav";
import { SampleQuestions } from "@/components/ask/SampleQuestions";
import { SearchBar } from "@/components/ask/SearchBar";
import { AnswerCard } from "@/components/ask/AnswerCard";
import { SourceDocuments } from "@/components/ask/SourceDocuments";
import { DebugPanel } from "@/components/ask/DebugPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { queryRAG } from "@/lib/api";
import { DEFAULT_CONFIG, type RagConfig, type QueryResponse } from "@/types/rag";
import { BarChart2, AlertCircle } from "lucide-react";

export default function Home() {
  // Layout state
  const [activeTab, setActiveTab] = useState<ActiveTab>("ask");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Query state
  const [query, setQuery] = useState("");
  const [config, setConfig] = useState<RagConfig>(DEFAULT_CONFIG);
  const [history, setHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSelectQuestion = useCallback((q: string) => {
    setQuery(q);
    setResult(null);
    setError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await queryRAG({
        query: trimmed,
        top_k: config.top_k,
        alpha: config.alpha,
        use_hybrid: config.use_hybrid,
      });
      setResult(data);
      setHistory((prev) =>
        prev.includes(trimmed) ? prev : [...prev, trimmed]
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }, [query, config, isLoading]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      <div className="relative flex flex-1">
        {/* Main content */}
        <main className="flex flex-1 flex-col" style={{ minWidth: 0 }}>
          {/* Tab bar */}
          <div
            className="border-b px-4 py-3 sm:px-6"
            style={{ borderColor: "var(--border)" }}
          >
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Tab content */}
          <div className="flex-1 px-4 py-6 sm:px-6">
            {activeTab === "ask" ? (
              <AskView
                query={query}
                onQueryChange={setQuery}
                onSubmit={handleSubmit}
                onSelectSample={handleSelectQuestion}
                isLoading={isLoading}
                result={result}
                error={error}
                config={config}
              />
            ) : (
              <EvaluationStub />
            )}
          </div>
        </main>

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          config={config}
          onConfigChange={setConfig}
          history={history}
          onSelectHistory={handleSelectQuestion}
        />
      </div>
    </div>
  );
}

/* ── Ask view ───────────────────────────────────────────────────────────── */

interface AskViewProps {
  query: string;
  onQueryChange: (v: string) => void;
  onSubmit: () => void;
  onSelectSample: (q: string) => void;
  isLoading: boolean;
  result: QueryResponse | null;
  error: string | null;
  config: RagConfig;
}

function AskView({
  query,
  onQueryChange,
  onSubmit,
  onSelectSample,
  isLoading,
  result,
  error,
  config,
}: AskViewProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Sample questions */}
      <SampleQuestions onSelect={onSelectSample} disabled={isLoading} />

      {/* Search bar */}
      <SearchBar
        query={query}
        onChange={onQueryChange}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />

      {/* Loading skeleton */}
      {isLoading && <LoadingSkeleton />}

      {/* Error */}
      {error && !isLoading && <ErrorCard message={error} />}

      {/* Results */}
      {result && !isLoading && (
        <div className="space-y-4">
          <AnswerCard answer={result.answer} latencyMs={result.latency_ms} />
          <SourceDocuments documents={result.documents} />
          {config.debug && <DebugPanel data={result} />}
        </div>
      )}

      {/* Empty state — nothing submitted yet */}
      {!isLoading && !result && !error && <EmptyState />}
    </div>
  );
}

/* ── Supporting UI pieces ────────────────────────────────────────────────── */

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="rounded-xl bg-card p-5 space-y-3" style={{ boxShadow: "var(--shadow-card)" }}>
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl bg-card p-4 space-y-2"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-12 rounded-full" />
            <Skeleton className="h-4 w-1/3" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
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
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--apple-red)" }} />
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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: "var(--apple-surface-2)" }}
      >
        <span className="text-2xl">🔬</span>
      </div>
      <div className="max-w-xs space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground">
          Ask a Research Question
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Search across 10,000 arXiv papers using hybrid retrieval and
          Groq-powered generation. Try a sample question above to get started.
        </p>
      </div>
    </div>
  );
}

/* ── Evaluation stub (Phase 7) ───────────────────────────────────────────── */

function EvaluationStub() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: "var(--apple-surface-2)" }}
      >
        <BarChart2 className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="max-w-xs space-y-1.5">
        <h2 className="text-xl font-semibold text-foreground">RAG Evaluation</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Run RAGAS faithfulness evaluation and view results with pass/fail scoring.
        </p>
      </div>
      <div
        className="mt-2 rounded-xl px-4 py-2 text-xs font-medium"
        style={{
          background: "var(--apple-surface-2)",
          color: "var(--apple-text-secondary)",
        }}
      >
        Evaluation tab coming in Phase 7
      </div>
    </div>
  );
}
