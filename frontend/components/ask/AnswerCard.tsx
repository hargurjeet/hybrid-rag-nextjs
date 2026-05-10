"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { LatencyBadge } from "@/components/ask/LatencyBadge";

interface AnswerCardProps {
  answer: string;
  latencyMs: number;
}

// Pre-process: wrap [Document N] citations in backticks so react-markdown
// treats them as inline code. We then intercept `code` to render them as
// styled badges instead of monospace code blocks.
function preprocessCitations(text: string): string {
  return text.replace(/\[Document (\d+)\]/g, "`[Document $1]`");
}

const CITATION_RE = /^\[Document \d+\]$/;

const markdownComponents: Components = {
  // Paragraphs — relaxed line-height for readability
  p: ({ children }) => (
    <p className="mb-3 text-[15px] leading-relaxed last:mb-0">{children}</p>
  ),

  // Inline code — render citations as blue badges, everything else as monospace
  code: ({ children, className }) => {
    const text = String(children).trim();
    if (CITATION_RE.test(text)) {
      return (
        <span
          className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-semibold"
          style={{
            background: "color-mix(in srgb, var(--apple-blue) 12%, transparent)",
            color: "var(--apple-blue)",
          }}
        >
          {text}
        </span>
      );
    }
    return (
      <code
        className={`rounded px-1 py-0.5 font-mono text-sm ${className ?? ""}`}
        style={{ background: "var(--apple-surface-2)" }}
      >
        {children}
      </code>
    );
  },

  // Unordered lists
  ul: ({ children }) => (
    <ul className="mb-3 ml-4 list-disc space-y-1 text-[15px] leading-relaxed">
      {children}
    </ul>
  ),

  // Ordered lists
  ol: ({ children }) => (
    <ol className="mb-3 ml-4 list-decimal space-y-1 text-[15px] leading-relaxed">
      {children}
    </ol>
  ),

  // Bold
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
};

export function AnswerCard({ answer, latencyMs }: AnswerCardProps) {
  const processed = preprocessCitations(answer);

  return (
    <div
      className="rounded-xl bg-card p-5 animate-fade-in"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Header row */}
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Answer
        </span>
        <LatencyBadge latencyMs={latencyMs} />
      </div>

      {/* Markdown content */}
      <div className="text-foreground">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {processed}
        </ReactMarkdown>
      </div>
    </div>
  );
}
