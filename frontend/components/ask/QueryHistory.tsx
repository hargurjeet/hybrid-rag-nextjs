"use client";

import { Clock } from "lucide-react";
import type { HistoryEntry } from "@/types/rag";

interface QueryHistoryProps {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
}

export function QueryHistory({ history, onSelect }: QueryHistoryProps) {
  if (history.length === 0) {
    return (
      <p className="text-xs italic text-muted-foreground">
        Your recent queries will appear here.
      </p>
    );
  }

  // Show last 5, most recent first
  const recent = [...history].reverse().slice(0, 5);

  return (
    <div className="space-y-0.5">
      {recent.map((entry, i) => (
        <button
          key={i}
          onClick={() => onSelect(entry)}
          className="group flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" />
          <span className="line-clamp-2 leading-snug">{entry.query}</span>
        </button>
      ))}
    </div>
  );
}
