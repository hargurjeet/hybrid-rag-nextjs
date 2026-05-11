"use client";

import { FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = ["astro-ph", "hep-th", "hep-ph", "quant-ph", "gr-qc", "cond-mat"];

export function OnboardingCard() {
  return (
    <div
      className="rounded-xl border-l-4 bg-card p-5"
      style={{
        borderColor: "var(--apple-blue)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <FlaskConical className="h-5 w-5 shrink-0" style={{ color: "var(--apple-blue)" }} />
        <h2 className="text-base font-semibold text-foreground">
          Hybrid RAG Research Assistant
        </h2>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed">
        This assistant retrieves the most relevant chunks from{" "}
        <strong className="text-foreground">10,000 arXiv papers</strong>, reranks
        them with Cohere, and generates a cited answer via Groq (Llama&nbsp;3). Pick
        a sample question below, type your own, or scope your query to specific
        papers using the filter.
      </p>

      <div className="flex flex-wrap gap-1.5 mt-3">
        {CATEGORIES.map((cat) => (
          <Badge key={cat} variant="secondary" className="font-mono text-xs">
            {cat}
          </Badge>
        ))}
      </div>
    </div>
  );
}
