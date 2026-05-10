"use client";

import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RunEvalButtonProps {
  isRunning: boolean;
  onClick: () => void;
}

export function RunEvalButton({ isRunning, onClick }: RunEvalButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isRunning}
      className="gap-2 rounded-full px-6 py-2.5 text-sm font-semibold transition-all"
      style={{ background: "var(--apple-blue)", color: "#FFFFFF" }}
      aria-label={isRunning ? "Evaluation is running" : "Run RAGAS evaluation"}
    >
      {isRunning ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Running…
        </>
      ) : (
        <>
          <Play className="h-4 w-4" />
          Run Evaluation
        </>
      )}
    </Button>
  );
}
