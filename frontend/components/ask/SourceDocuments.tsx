"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ExternalLink, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DocumentResult } from "@/types/rag";

interface SourceDocumentsProps {
  documents: DocumentResult[];
}

export function SourceDocuments({ documents }: SourceDocumentsProps) {
  if (documents.length === 0) return null;

  return (
    <div className="space-y-2 animate-fade-in">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Source Documents · {documents.length} retrieved
      </p>
      <div className="space-y-2">
        {documents.map((doc, index) => (
          <DocumentItem key={doc.paper_id + index} doc={doc} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}

function DocumentItem({ doc, rank }: { doc: DocumentResult; rank: number }) {
  const [open, setOpen] = useState(false);
  const score = doc.score ?? 0;
  const scorePercent = Math.round(score * 100);
  const categories = doc.categories
    ? doc.categories.split(",").map((c) => c.trim()).filter(Boolean)
    : [];
  const preview = doc.text.slice(0, 500);
  const hasMore = doc.text.length > 500;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-card transition-shadow duration-200",
        open ? "shadow-md" : ""
      )}
      style={{
        borderColor: "var(--border)",
        boxShadow: open ? "var(--shadow-elevated)" : "var(--shadow-card)",
      }}
    >
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-3 p-4 text-left hover:bg-secondary/50 transition-colors"
        aria-expanded={open}
      >
        {/* Rank badge */}
        <span
          className="mt-0.5 flex h-5 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style={{ background: "var(--apple-blue)" }}
        >
          #{rank}
        </span>

        {/* Content */}
        <div className="flex-1 space-y-2 min-w-0">
          {/* Top row: title/paper id + score + chevron */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {doc.title ? (
                <p className="truncate text-sm font-medium text-foreground leading-snug">
                  {doc.title}
                </p>
              ) : null}
              {doc.paper_id && (
                <a
                  href={`https://arxiv.org/abs/${doc.paper_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs hover:underline"
                  style={{ color: "var(--apple-blue)" }}
                >
                  arXiv:{doc.paper_id}
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                {scorePercent}%
              </span>
              {open ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Score bar */}
          <div
            className="h-1 w-full overflow-hidden rounded-full"
            style={{ background: "var(--apple-surface-2)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${scorePercent}%`,
                background:
                  "linear-gradient(90deg, var(--apple-blue), #34C759)",
              }}
            />
          </div>

          {/* Category tags */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="rounded-full px-2 py-0.5 text-[10px]">
                  {cat}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </button>

      {/* Expanded text preview */}
      {open && (
        <div
          className="border-t px-4 pb-4 pt-3"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <FileText className="h-3 w-3 text-muted-foreground" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Excerpt
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {preview}
            {hasMore && (
              <span className="text-muted-foreground/60"> …</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
