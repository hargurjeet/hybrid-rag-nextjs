"use client";

import { Layers, Brain, Blend } from "lucide-react";

interface QuestionGroup {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  questions: string[];
}

const QUESTION_GROUPS: QuestionGroup[] = [
  {
    id: "keyword",
    label: "Keyword / Exact Match",
    description: "Tests BM25 sparse retrieval — queries with precise technical terms",
    icon: Layers,
    questions: [
      "What is the Aharonov-Bohm effect in quantum rings?",
      "How does Feshbach resonance control interactions in ultracold Fermi gases?",
      "What is the lattice Boltzmann method for entropy stabilization?",
    ],
  },
  {
    id: "semantic",
    label: "Semantic / Conceptual",
    description: "Tests dense vector retrieval — conceptual queries without exact jargon",
    icon: Brain,
    questions: [
      "How does gravity bend light near a massive object?",
      "What role do phonons play in pairing electrons inside superconductors?",
      "How do astronomers study star formation in large molecular clouds?",
    ],
  },
  {
    id: "hybrid",
    label: "Hybrid & Reasoning",
    description: "Tests both retrieval modes together — cross-topic reasoning queries",
    icon: Blend,
    questions: [
      "How do Bose-Einstein condensates and superconductors resemble each other?",
      "What distinguishes strongly correlated Mott insulators from ordinary metals?",
      "Compare quantum field theory on curved spacetime with flat spacetime predictions",
    ],
  },
];

interface SampleQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function SampleQuestions({ onSelect, disabled }: SampleQuestionsProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Sample Queries
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {QUESTION_GROUPS.map((group) => {
          const Icon = group.icon;
          return (
            <div
              key={group.id}
              className="rounded-xl border p-3.5 space-y-2.5"
              style={{
                borderColor: "var(--border)",
                background: "var(--card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {/* Group header */}
              <div className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--apple-blue)" }} />
                <span className="text-xs font-semibold text-foreground leading-tight">
                  {group.label}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                {group.description}
              </p>

              {/* Questions */}
              <div className="space-y-1.5">
                {group.questions.map((q) => (
                  <button
                    key={q}
                    onClick={() => onSelect(q)}
                    disabled={disabled}
                    aria-label={`Ask: ${q}`}
                    className="w-full rounded-lg px-3 py-2 text-left text-xs leading-snug text-foreground transition-all duration-150 hover:opacity-80 disabled:pointer-events-none disabled:opacity-50"
                    style={{
                      background: "var(--apple-surface-2)",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
