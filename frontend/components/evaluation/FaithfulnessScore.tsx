interface FaithfulnessScoreProps {
  score: number;
  passed: boolean;
  threshold: number;
}

export function FaithfulnessScore({ score, passed, threshold }: FaithfulnessScoreProps) {
  const percent = (score * 100).toFixed(1);
  const color = passed ? "var(--apple-green)" : "var(--apple-red)";

  return (
    <div
      className="rounded-xl bg-card p-6 animate-fade-in"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Faithfulness Score
        </span>
        <span className="text-xs text-muted-foreground">
          Threshold: {(threshold * 100).toFixed(0)}%
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-5xl font-bold tabular-nums" style={{ color }}>
          {percent}%
        </span>
        <span
          className="rounded-full px-3 py-1 text-sm font-semibold"
          style={{
            background: `color-mix(in srgb, ${color} 15%, transparent)`,
            color,
          }}
        >
          {passed ? "✓ PASS" : "✗ FAIL"}
        </span>
      </div>

      <div
        className="mt-4 h-2 w-full overflow-hidden rounded-full"
        style={{ background: "var(--apple-surface-2)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${percent}%`,
            background: passed
              ? "linear-gradient(90deg, var(--apple-green), #34C759)"
              : "linear-gradient(90deg, var(--apple-red), #FF6B6B)",
          }}
        />
      </div>
    </div>
  );
}
