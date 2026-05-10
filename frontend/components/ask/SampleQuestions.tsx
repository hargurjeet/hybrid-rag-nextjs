"use client";

import { Sparkles } from "lucide-react";

const SAMPLES = [
  "What are multidimension recurrent neural networks?",
  "What bottom friction model is used in the shallow-water flows study?",
  "Explain the Chezy law",
];

interface SampleQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function SampleQuestions({ onSelect, disabled }: SampleQuestionsProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Try a sample question
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {SAMPLES.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            disabled={disabled}
            className="rounded-full border px-4 py-1.5 text-sm text-foreground transition-all duration-150 hover:bg-secondary hover:border-transparent disabled:pointer-events-none disabled:opacity-50"
            style={{ borderColor: "var(--border)" }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
