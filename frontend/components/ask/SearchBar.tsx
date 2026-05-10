"use client";

import { type FormEvent, useRef, useEffect } from "react";
import { Search, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function SearchBar({ query, onChange, onSubmit, isLoading }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when a sample question is selected
  useEffect(() => {
    if (query && !isLoading) inputRef.current?.focus();
  }, [query, isLoading]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (query.trim() && !isLoading) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      {/* Input */}
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(e as unknown as FormEvent)}
          placeholder="Ask a research question…"
          disabled={isLoading}
          aria-label="Research question"
          className="w-full rounded-xl border bg-card py-3.5 pl-11 pr-4 text-[15px] text-foreground outline-none transition-all placeholder:text-muted-foreground focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            borderColor: "var(--border)",
            boxShadow: "var(--shadow-card)",
            // @ts-expect-error CSS custom property
            "--tw-ring-color": "var(--apple-blue)",
          }}
        />
      </div>

      {/* Submit button */}
      <Button
        type="submit"
        disabled={!query.trim() || isLoading}
        className="h-[52px] gap-2 rounded-xl px-6 text-[15px] font-medium text-white transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-50"
        style={{ background: "var(--apple-blue)" }}
        aria-label="Submit query"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <span>Search</span>
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
