"use client";

import { useState } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { TabNav, type ActiveTab } from "@/components/layout/TabNav";
import { Search, BarChart2, FlaskConical } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("ask");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <NavBar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />

      {/* Main layout — content + sidebar */}
      <div className="relative flex flex-1">

        {/* Content area */}
        <main
          className="flex flex-1 flex-col transition-all duration-300"
          style={{ minWidth: 0 }}
        >
          {/* Tab bar */}
          <div className="border-b px-4 py-3 sm:px-6" style={{ borderColor: "var(--border)" }}>
            <TabNav activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Tab content */}
          <div className="flex-1 px-4 py-6 sm:px-6">
            {activeTab === "ask" ? <AskStub /> : <EvaluationStub />}
          </div>
        </main>

        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
    </div>
  );
}

/* ── Stub tab views (replaced in Phase 5 & 7) ──────────────────────────── */

function AskStub() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-24 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: "var(--apple-surface-2)" }}
      >
        <Search className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="space-y-1.5 max-w-xs">
        <h2 className="text-xl font-semibold text-foreground">Ask a Research Question</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Search across 10,000 arXiv papers using hybrid retrieval and Groq-powered generation.
        </p>
      </div>
      <div
        className="mt-2 rounded-xl px-4 py-2 text-xs font-medium"
        style={{
          background: "var(--apple-surface-2)",
          color: "var(--apple-text-secondary)",
        }}
      >
        Query interface coming in Phase 5
      </div>
    </div>
  );
}

function EvaluationStub() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-24 text-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl"
        style={{ background: "var(--apple-surface-2)" }}
      >
        <BarChart2 className="h-7 w-7 text-muted-foreground" />
      </div>
      <div className="space-y-1.5 max-w-xs">
        <h2 className="text-xl font-semibold text-foreground">RAG Evaluation</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
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
