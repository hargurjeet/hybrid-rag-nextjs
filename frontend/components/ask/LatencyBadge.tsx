interface LatencyBadgeProps {
  latencyMs: number;
}

export function LatencyBadge({ latencyMs }: LatencyBadgeProps) {
  const seconds = (latencyMs / 1000).toFixed(1);
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        background: "var(--apple-surface-2)",
        color: "var(--apple-text-secondary)",
      }}
    >
      ⏱ {seconds}s
    </span>
  );
}
