"use client";

import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { RagConfig } from "@/types/rag";

interface SettingsPanelProps {
  config: RagConfig;
  onChange: (config: RagConfig) => void;
}

export function SettingsPanel({ config, onChange }: SettingsPanelProps) {
  const update = (partial: Partial<RagConfig>) =>
    onChange({ ...config, ...partial });

  return (
    <div className="space-y-5">
      {/* Top-K Results */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Top-K Results</span>
          <span
            className="text-sm font-semibold tabular-nums"
            style={{ color: "var(--apple-blue)" }}
          >
            {config.top_k}
          </span>
        </div>
        <Slider
          min={1}
          max={10}
          step={1}
          value={[config.top_k]}
          onValueChange={(v) => update({ top_k: typeof v === "number" ? v : v[0] })}
          aria-label="Top-K results"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Hybrid Alpha */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Hybrid Alpha</span>
          <span
            className="text-sm font-semibold tabular-nums"
            style={{ color: "var(--apple-blue)" }}
          >
            {config.alpha.toFixed(1)}
          </span>
        </div>
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={[config.alpha]}
          onValueChange={(v) => update({ alpha: typeof v === "number" ? v : v[0] })}
          aria-label="Hybrid alpha weight"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>BM25</span>
          <span>Vector</span>
        </div>
      </div>

      {/* Retrieval Mode */}
      <div className="space-y-2">
        <span className="text-sm text-foreground">Retrieval Mode</span>
        <div
          className="flex w-full items-center gap-1 rounded-lg p-1"
          style={{ background: "var(--apple-surface-2)" }}
          role="group"
          aria-label="Retrieval mode"
        >
          {(["Hybrid", "Vector"] as const).map((mode) => {
            const isActive = (mode === "Hybrid") === config.use_hybrid;
            return (
              <button
                key={mode}
                onClick={() => update({ use_hybrid: mode === "Hybrid" })}
                aria-pressed={isActive}
                className={cn(
                  "flex-1 rounded-md py-1.5 text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Debug Info */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-foreground">Debug Info</span>
          <p className="text-[11px] text-muted-foreground">Show raw JSON response</p>
        </div>
        <Switch
          checked={config.debug}
          onCheckedChange={(v) => update({ debug: v })}
          aria-label="Toggle debug info"
        />
      </div>
    </div>
  );
}
