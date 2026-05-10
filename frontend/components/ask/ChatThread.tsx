"use client";

import { useEffect, useRef, useState } from "react";
import { FlaskConical, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { SourceDocuments } from "@/components/ask/SourceDocuments";
import { LatencyBadge } from "@/components/ask/LatencyBadge";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types/rag";

interface ChatThreadProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export function ChatThread({ messages, isLoading }: ChatThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isLoading]);

  return (
    <div className="space-y-6 pb-2">
      {messages.map((msg) =>
        msg.role === "user" ? (
          <UserBubble key={msg.id} content={msg.content} />
        ) : (
          <AssistantBubble key={msg.id} message={msg} />
        )
      )}
      {isLoading && <ThinkingBubble />}
      <div ref={bottomRef} />
    </div>
  );
}

/* ── User message ─────────────────────────────────────────────────────────── */

function UserBubble({ content }: { content: string }) {
  return (
    <div className="flex justify-end">
      <div
        className="max-w-[78%] rounded-2xl rounded-tr-sm px-4 py-3 text-white animate-fade-in"
        style={{ background: "var(--apple-blue)" }}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

/* ── Assistant message ────────────────────────────────────────────────────── */

function AssistantBubble({ message }: { message: ChatMessage }) {
  return (
    <div className="flex gap-3 animate-fade-in">
      {/* Avatar */}
      <div
        className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{ background: "var(--apple-blue)" }}
      >
        <FlaskConical className="h-4 w-4 text-white" />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        {/* Answer card */}
        <div
          className="rounded-xl bg-card p-4"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Answer
            </span>
            {message.latency_ms !== undefined && (
              <LatencyBadge latencyMs={message.latency_ms} />
            )}
          </div>
          <div className="text-foreground">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {preprocessCitations(message.content)}
            </ReactMarkdown>
          </div>
        </div>

        {/* Collapsible sources */}
        {message.documents && message.documents.length > 0 && (
          <CollapsibleSources documents={message.documents} />
        )}
      </div>
    </div>
  );
}

function CollapsibleSources({
  documents,
}: {
  documents: NonNullable<ChatMessage["documents"]>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-expanded={open}
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-200",
            open && "rotate-90"
          )}
        />
        {open ? "Hide" : "Show"} {documents.length} source
        {documents.length !== 1 ? "s" : ""}
      </button>
      {open && (
        <div className="mt-2">
          <SourceDocuments documents={documents} />
        </div>
      )}
    </div>
  );
}

/* ── Thinking indicator ───────────────────────────────────────────────────── */

function ThinkingBubble() {
  return (
    <div className="flex gap-3">
      <div
        className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
        style={{ background: "var(--apple-blue)" }}
      >
        <FlaskConical className="h-4 w-4 text-white" />
      </div>
      <div
        className="rounded-xl bg-card px-4 py-3"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center gap-1.5 h-6">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Markdown helpers (shared with AnswerCard) ────────────────────────────── */

function preprocessCitations(text: string): string {
  return text.replace(/\[Document (\d+)\]/g, "`[Document $1]`");
}

const CITATION_RE = /^\[Document \d+\]$/;

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-3 text-[15px] leading-relaxed last:mb-0">{children}</p>
  ),
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
  ul: ({ children }) => (
    <ul className="mb-3 ml-4 list-disc space-y-1 text-[15px] leading-relaxed">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 ml-4 list-decimal space-y-1 text-[15px] leading-relaxed">
      {children}
    </ol>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
};
