# System Architecture

## Overview

The Hybrid RAG Research Assistant is a two-tier application:

1. **FastAPI backend** — wraps the Python RAG pipeline and exposes it as an HTTP API
2. **Next.js frontend** — Apple-designed UI that calls the FastAPI backend

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│              Next.js Frontend (port 3000)                │
│   ┌──────────┐  ┌────────────┐  ┌───────────────────┐   │
│   │ Ask Tab  │  │ Eval Tab   │  │  Sidebar/Settings  │   │
│   └──────────┘  └────────────┘  └───────────────────┘   │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP (JSON / SSE)
                      ▼
┌─────────────────────────────────────────────────────────┐
│               FastAPI Backend (port 8000)                │
│   POST /api/query          GET /api/evaluate/stream      │
│   GET  /api/health         GET /api/evaluation-results   │
└──────────┬──────────────────────────────────────────────┘
           │ Python function call
           ▼
┌─────────────────────────────────────────────────────────┐
│                  RAG Pipeline (ui/pipeline.py)           │
│                                                          │
│   1. retrieve_chroma()    ←──── ChromaDB (chroma_db/)   │
│      (vector search, top_k×4 candidates)                 │
│                                                          │
│   2. rerank_with_cohere() ←──── Cohere API              │
│      (rerank-english-v3.0, top_k final)                  │
│                                                          │
│   3. generate_answer_with_llama() ←── Groq API          │
│      (llama-3.1-70b-versatile)                           │
│      OR Ollama (local dev)                               │
│      OR HuggingFace Inference                            │
└─────────────────────────────────────────────────────────┘
           │
           ▼ tracing
┌──────────────────┐
│ Langfuse Cloud   │
│ (observability)  │
└──────────────────┘
```

## Data Ingestion (one-time setup)

```
dataset/arxiv_10k.json (JSONL)
  → load_arxiv_documents()   parse title + abstract per paper
  → chunk_documents()        RecursiveCharacterTextSplitter (500 chars, 100 overlap)
  → upload_chunks_chroma()   embed with all-mpnet-base-v2, store in ChromaDB
```

The ChromaDB index is pre-built and committed to the repo via Git LFS (`chroma_db/`). Re-ingestion only needed if the dataset changes.

## Query Flow (per request)

```
User query + config (top_k, alpha, use_hybrid)
  │
  ▼ POST /api/query
FastAPI validates request → calls run_pipeline()
  │
  ▼ retrieve_chroma(query, top_k * 4)
ChromaDB cosine similarity search
  → returns top_k*4 candidate chunks [{text, paper_id, categories, title}]
  │
  ▼ rerank_with_cohere(query, candidates, top_k)
Cohere rerank-english-v3.0 cross-encoder
  → returns top_k chunks sorted by relevance_score
  │
  ▼ generate_answer_with_llama(query, reranked_docs)
Builds prompt: "Answer using ONLY these documents. Cite as [Document X]."
Groq API → llama-3.1-70b-versatile
  → returns cited answer string
  │
  ▼ FastAPI returns
{ answer, documents: [{paper_id, title, categories, text, score}], latency_ms }
```

## Evaluation Flow (CI + UI)

```
evaluation/evaluate_rag.py
  → load 5 Q&A pairs from evaluation_qa_dataset_5.json
  → for each question: retrieve → rerank_local (CrossEncoder) → generate answer
  → RAGAS evaluate(faithfulness metric)
  → save rag_evaluation_results.csv
  → exit(1) if avg_faithfulness < 0.7
```

This runs automatically on every push to `main` via `.github/workflows/rag_eval.yml`.

## LLM Backend Selection

Controlled entirely by environment variables — no code changes needed:

| USE_GROQ | USE_HF_INFERENCE | Backend used |
|----------|-----------------|--------------|
| true | — | Groq API (recommended for production) |
| false | true | HuggingFace Inference API |
| false | false | Ollama (local, default) |

## Key Design Decisions

- **ChromaDB over Weaviate**: Weaviate's hybrid search (`hybrid_retrieve_documents` in `src/utils.py`) was explored but ChromaDB was chosen for its zero-infrastructure local deployment. The Weaviate code is preserved but unused.
- **Cohere reranking**: Cross-encoder reranking significantly improves relevance vs pure vector search. A local `BAAI/bge-reranker-large` CrossEncoder alternative exists in `rerank_local()` — used in evaluation to avoid Cohere API calls in CI.
- **instructor + Mode.JSON**: Structured output via `instructor` library ensures the LLM response can be validated against Pydantic schemas when needed.
- **Git LFS for ChromaDB**: `.bin`, `.sqlite3`, `.pickle` files tracked via LFS to keep the repo lean while keeping the pre-built index available in CI.
