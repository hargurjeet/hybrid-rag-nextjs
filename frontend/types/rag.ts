export interface DocumentResult {
  paper_id: string;
  title: string | null;
  categories: string | null;
  text: string;
  score: number | null;
}

export interface QueryRequest {
  query: string;
  top_k?: number;
  alpha?: number;
  use_hybrid?: boolean;
}

export interface QueryResponse {
  answer: string;
  documents: DocumentResult[];
  latency_ms: number;
}

export interface RagConfig {
  top_k: number;
  alpha: number;
  use_hybrid: boolean;
  debug: boolean;
}

export const DEFAULT_CONFIG: RagConfig = {
  top_k: 5,
  alpha: 0.5,
  use_hybrid: true,
  debug: false,
};
