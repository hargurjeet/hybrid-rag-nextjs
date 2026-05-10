"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface DebugPanelProps {
  data: unknown;
}

export function DebugPanel({ data }: DebugPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="overflow-hidden rounded-xl border"
      style={{ borderColor: "var(--border)", background: "var(--apple-surface-2)" }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-secondary"
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Debug — Raw JSON
        </span>
      </button>

      {open && (
        <div className="border-t px-4 py-3" style={{ borderColor: "var(--border)" }}>
          <pre className="max-h-96 overflow-auto font-mono text-xs leading-relaxed text-muted-foreground">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
