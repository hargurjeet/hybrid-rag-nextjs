import type { QueryRequest, QueryResponse, EvaluationResults, PaperSummary } from "@/types/rag";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export async function queryRAG(params: QueryRequest): Promise<QueryResponse> {
  const res = await fetch(`${API_URL}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const err = await res.json();
      message = (err as { detail?: string }).detail ?? message;
    } catch {
      // ignore parse error, use status message
    }
    throw new Error(message);
  }

  return res.json() as Promise<QueryResponse>;
}

export async function fetchEvaluationResults(): Promise<EvaluationResults> {
  const res = await fetch(`${API_URL}/api/evaluation-results`);
  if (!res.ok) {
    let message = `Status ${res.status}`;
    try {
      const err = await res.json();
      message = (err as { detail?: string }).detail ?? message;
    } catch { /* ignore */ }
    throw new Error(message);
  }
  return res.json() as Promise<EvaluationResults>;
}

export const EVAL_STREAM_URL = `${API_URL}/api/evaluate/stream`;

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/health`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

export async function searchPapers(q: string, limit = 20): Promise<PaperSummary[]> {
  const params = new URLSearchParams({ q, limit: String(limit) });
  const res = await fetch(`${API_URL}/api/papers?${params.toString()}`);
  if (!res.ok) throw new Error(`Papers search failed: ${res.status}`);
  return res.json() as Promise<PaperSummary[]>;
}
