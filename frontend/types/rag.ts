export interface DocumentResult {
  paper_id: string;
  title: string | null;
  categories: string | null;
  text: string;
  score: number | null;
}

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  documents?: DocumentResult[];
  latency_ms?: number;
}

export interface PaperSummary {
  paper_id: string;
  title: string;
  categories: string;
  authors_preview: string;
}

export interface QueryRequest {
  query: string;
  top_k?: number;
  alpha?: number;
  use_hybrid?: boolean;
  chat_history?: ChatHistoryItem[];
  paper_ids?: string[];
}

export interface QueryResponse {
  answer: string;
  documents: DocumentResult[];
  latency_ms: number;
}

export interface EvaluationRecord {
  question?: string;
  answer?: string;
  faithfulness?: number;
  answer_relevancy?: number;
  [key: string]: unknown;
}

export interface EvaluationResults {
  results: EvaluationRecord[];
  avg_faithfulness: number | null;
  passed: boolean | null;
  threshold: number;
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

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  selectedPapers: PaperSummary[];
  savedAt: Date;
}
