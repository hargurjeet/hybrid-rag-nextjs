"use client";

import { type KeyboardEvent, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  query: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  hasMessages: boolean;
}

export function ChatInput({ query, onChange, onSubmit, isLoading, hasMessages }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea up to ~5 lines
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [query]);

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() && !isLoading) onSubmit();
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (query.trim() && !isLoading) onSubmit();
      }}
      className="flex items-end gap-2"
    >
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={hasMessages ? "Ask a follow-up… (Shift+Enter for new line)" : "Ask a research question…"}
          disabled={isLoading}
          rows={1}
          aria-label="Message"
          className="w-full resize-none rounded-xl border bg-card px-4 py-3 text-[15px] text-foreground outline-none transition-all placeholder:text-muted-foreground focus:ring-2 disabled:opacity-60"
          style={{
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-card)",
            // @ts-expect-error CSS custom property
            "--tw-ring-color": "var(--apple-blue)",
            lineHeight: "1.5",
          }}
        />
      </div>

      <Button
        type="submit"
        disabled={!query.trim() || isLoading}
        className="h-11 w-11 shrink-0 rounded-xl text-white transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-50"
        style={{ background: "var(--apple-blue)" }}
        aria-label="Send message"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}
