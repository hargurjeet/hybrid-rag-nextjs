"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle, BarChart2 } from "lucide-react";
import { RunEvalButton } from "./RunEvalButton";
import { LogStream } from "./LogStream";
import { ResultsTable } from "./ResultsTable";
import { FaithfulnessScore } from "./FaithfulnessScore";
import { fetchEvaluationResults, EVAL_STREAM_URL } from "@/lib/api";
import type { EvaluationResults } from "@/types/rag";

export function EvaluationView() {
  const [isRunning, setIsRunning] = useState(false);
  const [logLines, setLogLines] = useState<string[]>([]);
  const [results, setResults] = useState<EvaluationResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load existing results on first render (if any)
  useEffect(() => {
    fetchEvaluationResults()
      .then(setResults)
      .catch(() => {}); // 404 is expected when no results exist yet
  }, []);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    setLogLines([]);
    setError(null);

    const es = new EventSource(EVAL_STREAM_URL);

    es.onmessage = (e: MessageEvent<string>) => {
      if (e.data === "[DONE]") {
        es.close();
        setIsRunning(false);
        fetchEvaluationResults()
          .then(setResults)
          .catch((err: Error) => setError(err.message));
      } else {
        setLogLines((prev) => [...prev, e.data]);
      }
    };

    es.onerror = () => {
      es.close();
      setIsRunning(false);
      setError("Evaluation stream disconnected. Check that the backend is running.");
    };
  }, []);

  const hasResults = results?.avg_faithfulness != null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">RAG Evaluation</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            RAGAS faithfulness evaluation — 5 test questions from arXiv dataset
          </p>
        </div>
        <RunEvalButton isRunning={isRunning} onClick={handleRun} />
      </div>

      {/* Faithfulness score card */}
      {hasResults && (
        <FaithfulnessScore
          score={results!.avg_faithfulness!}
          passed={results!.passed ?? false}
          threshold={results!.threshold}
        />
      )}

      {/* Live log stream */}
      <LogStream lines={logLines} isRunning={isRunning} />

      {/* Error */}
      {error && !isRunning && (
        <div
          className="flex items-start gap-3 rounded-xl border p-4 animate-fade-in"
          role="alert"
          style={{
            borderColor: "var(--apple-red)",
            background: "color-mix(in srgb, var(--apple-red) 8%, transparent)",
          }}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--apple-red)" }} />
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--apple-red)" }}>
              Evaluation failed
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}

      {/* Results table */}
      {results?.results && results.results.length > 0 && (
        <ResultsTable results={results.results} />
      )}

      {/* Empty state */}
      {!isRunning && !hasResults && !error && logLines.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "var(--apple-surface-2)" }}
          >
            <BarChart2 className="h-7 w-7 text-muted-foreground" />
          </div>
          <div className="max-w-xs space-y-1.5">
            <h3 className="text-lg font-semibold text-foreground">No Results Yet</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Click <strong>Run Evaluation</strong> to score the RAG pipeline on 5 arXiv test
              questions using RAGAS faithfulness metric.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
