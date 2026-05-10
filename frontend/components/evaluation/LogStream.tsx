"use client";

import { useEffect, useRef } from "react";
import { Terminal } from "lucide-react";

interface LogStreamProps {
  lines: string[];
  isRunning: boolean;
}

export function LogStream({ lines, isRunning }: LogStreamProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  if (lines.length === 0 && !isRunning) return null;

  return (
    <div
      className="overflow-hidden rounded-xl border animate-fade-in"
      style={{ borderColor: "var(--border)", background: "var(--apple-surface-2)" }}
      role="log"
      aria-label="Evaluation log output"
      aria-live="polite"
    >
      <div
        className="flex items-center gap-2 border-b px-4 py-2.5"
        style={{ borderColor: "var(--border)" }}
      >
        <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Evaluation Log
        </span>
        {isRunning && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ background: "var(--apple-green)" }}
            />
            Running
          </span>
        )}
      </div>

      <div className="max-h-72 overflow-y-auto px-4 py-3">
        <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-muted-foreground">
          {lines.join("\n")}
          {isRunning && <span className="animate-pulse">▋</span>}
        </pre>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
