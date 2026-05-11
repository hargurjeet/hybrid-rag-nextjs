"use client";

import { useState, useEffect, useRef } from "react";
import { BookOpen, Search, Loader2, X, CheckCircle2, Circle } from "lucide-react";
import { searchPapers } from "@/lib/api";
import type { PaperSummary } from "@/types/rag";

const SAMPLE_PAPERS: PaperSummary[] = [
  {
    paper_id: "0704.0001",
    title: "Calculation of prompt diphoton production cross sections at Tevatron and LHC energies",
    categories: "hep-ph",
    authors_preview: "C. Balázs, E. L. Berger et al.",
  },
  {
    paper_id: "0704.0007",
    title: "Polymer Quantum Mechanics and its Continuum Limit",
    categories: "gr-qc quant-ph",
    authors_preview: "",
  },
  {
    paper_id: "0704.0015",
    title: "Fermionic superstring loop amplitudes in the pure spinor formalism",
    categories: "hep-th",
    authors_preview: "",
  },
  {
    paper_id: "0704.0023",
    title: "ALMA as the ideal probe of the solar chromosphere",
    categories: "astro-ph",
    authors_preview: "",
  },
  {
    paper_id: "0704.0027",
    title: "Filling-Factor-Dependent Magnetophonon Resonance in Graphene",
    categories: "cond-mat",
    authors_preview: "",
  },
];

interface PaperFilterBarProps {
  selectedPapers: PaperSummary[];
  onSelectedPapersChange: (papers: PaperSummary[]) => void;
  disabled?: boolean;
}

export function PaperFilterBar({
  selectedPapers,
  onSelectedPapersChange,
  disabled,
}: PaperFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<PaperSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        setResults(await searchPapers(searchQuery));
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Collapse on outside click
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  function togglePaper(paper: PaperSummary) {
    const isSelected = selectedPapers.some((p) => p.paper_id === paper.paper_id);
    if (isSelected) {
      onSelectedPapersChange(selectedPapers.filter((p) => p.paper_id !== paper.paper_id));
    } else if (selectedPapers.length < 3) {
      onSelectedPapersChange([...selectedPapers, paper]);
    }
  }

  return (
    <div ref={containerRef} className="shrink-0">
      {/* Trigger row — always visible */}
      <div
        className="flex flex-wrap items-center gap-2 px-4 py-2 sm:px-6"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <button
          onClick={() => !disabled && setIsExpanded((o) => !o)}
          disabled={disabled}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: isExpanded ? "var(--apple-blue)" : "var(--muted-foreground)" }}
          aria-expanded={isExpanded}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Filter by paper
        </button>

        {selectedPapers.map((paper) => (
          <PaperChip
            key={paper.paper_id}
            paper={paper}
            onRemove={() =>
              onSelectedPapersChange(selectedPapers.filter((p) => p.paper_id !== paper.paper_id))
            }
          />
        ))}

        {selectedPapers.length > 0 && (
          <span className="ml-auto text-xs text-muted-foreground">
            Scoped to {selectedPapers.length} paper{selectedPapers.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Expanded search area */}
      {isExpanded && (
        <div
          className="border-t px-4 pb-3 pt-2 sm:px-6"
          style={{ borderColor: "var(--border)", background: "var(--apple-surface-2)" }}
        >
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setIsExpanded(false);
                  setSearchQuery("");
                }
              }}
              placeholder="Search by title or category…"
              className="w-full rounded-lg border bg-card py-2 pl-9 pr-8 text-sm placeholder:text-muted-foreground outline-none focus:ring-2"
              style={
                {
                  borderColor: "var(--border)",
                  "--tw-ring-color": "var(--apple-blue)",
                } as React.CSSProperties
              }
              aria-label="Search papers"
            />
            {isSearching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Sample papers — shown when search box is empty */}
          {!searchQuery.trim() && (
            <div
              className="mt-2 rounded-lg border bg-card overflow-hidden"
              style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-elevated)" }}
            >
              <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground border-b" style={{ borderColor: "var(--border)" }}>
                Sample papers
              </p>
              {SAMPLE_PAPERS.map((paper) => {
                const isSelected = selectedPapers.some((p) => p.paper_id === paper.paper_id);
                const isDisabled = !isSelected && selectedPapers.length >= 3;
                return (
                  <PaperResultRow
                    key={paper.paper_id}
                    paper={paper}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    onToggle={() => togglePaper(paper)}
                  />
                );
              })}
            </div>
          )}

          {/* Search results */}
          {searchQuery.trim() && results.length > 0 && (
            <div
              className="mt-2 max-h-56 overflow-y-auto rounded-lg border bg-card"
              style={{ borderColor: "var(--border)", boxShadow: "var(--shadow-elevated)" }}
            >
              {results.map((paper) => {
                const isSelected = selectedPapers.some((p) => p.paper_id === paper.paper_id);
                const isDisabled = !isSelected && selectedPapers.length >= 3;
                return (
                  <PaperResultRow
                    key={paper.paper_id}
                    paper={paper}
                    isSelected={isSelected}
                    isDisabled={isDisabled}
                    onToggle={() => togglePaper(paper)}
                  />
                );
              })}
            </div>
          )}

          {/* No results */}
          {searchQuery.trim() && !isSearching && results.length === 0 && (
            <p className="mt-2 py-4 text-center text-xs text-muted-foreground">
              No papers found for &ldquo;{searchQuery}&rdquo;
            </p>
          )}

          {/* Max limit hint */}
          {selectedPapers.length >= 3 && (
            <p className="mt-1 text-xs text-muted-foreground">Maximum 3 papers selected.</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */

function PaperChip({ paper, onRemove }: { paper: PaperSummary; onRemove: () => void }) {
  const title =
    paper.title.length > 30 ? paper.title.slice(0, 27) + "…" : paper.title;
  return (
    <span
      className="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ background: "var(--apple-surface-2)", color: "var(--foreground)" }}
    >
      {title}
      <button
        onClick={onRemove}
        className="ml-0.5 transition-colors hover:text-foreground"
        style={{ color: "var(--muted-foreground)" }}
        aria-label={`Remove ${paper.title}`}
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function PaperResultRow({
  paper,
  isSelected,
  isDisabled,
  onToggle,
}: {
  paper: PaperSummary;
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
      style={
        isSelected
          ? { background: "color-mix(in srgb, var(--apple-blue) 8%, transparent)" }
          : undefined
      }
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{paper.title}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span
            className="font-mono text-[11px]"
            style={{ color: "var(--muted-foreground)" }}
          >
            {paper.paper_id}
          </span>
          <span className="text-[11px] text-muted-foreground">{paper.categories}</span>
        </div>
      </div>
      {isSelected ? (
        <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--apple-blue)" }} />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
    </button>
  );
}
