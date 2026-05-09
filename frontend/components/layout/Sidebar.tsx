"use client";

import { cn } from "@/lib/utils";
import { SlidersHorizontal, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed right-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-72 overflow-y-auto",
          "glass border-l transition-transform duration-300 ease-in-out",
          "md:sticky md:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        )}
        style={{ borderColor: "var(--glass-border)" }}
        aria-label="Settings panel"
      >
        <div className="flex flex-col gap-6 p-5">

          {/* Mobile close button */}
          <div className="flex items-center justify-between md:hidden">
            <span className="text-sm font-semibold text-foreground">Settings</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-7 w-7"
              aria-label="Close settings"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Settings section — stub (filled in Phase 5) */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Settings
              </span>
            </div>
            <div className="space-y-4">
              {/* Top-K stub */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Top-K Results</span>
                  <span className="text-sm font-medium text-muted-foreground">5</span>
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>

              {/* Alpha stub */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Hybrid Alpha</span>
                  <span className="text-sm font-medium text-muted-foreground">0.5</span>
                </div>
                <Skeleton className="h-1.5 w-full rounded-full" />
              </div>

              {/* Retrieval mode stub */}
              <div className="space-y-1.5">
                <span className="text-sm text-foreground">Retrieval Mode</span>
                <div
                  className="mt-1 flex w-full items-center gap-1 rounded-lg p-1"
                  style={{ background: "var(--apple-surface-2)" }}
                >
                  <div className="flex-1 rounded-md bg-card py-1 text-center text-xs font-medium shadow-sm">
                    Hybrid
                  </div>
                  <div className="flex-1 py-1 text-center text-xs font-medium text-muted-foreground">
                    Vector
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div
            className="h-px w-full"
            style={{ background: "var(--border)" }}
          />

          {/* Query history section — stub (filled in Phase 5) */}
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Recent Queries
              </span>
            </div>
            <div className="space-y-2">
              {["What are MDRNNs?", "Explain self-attention", "Chezy law"].map(
                (q) => (
                  <button
                    key={q}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {q}
                  </button>
                )
              )}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
