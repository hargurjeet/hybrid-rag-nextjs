# Hybrid RAG Research Assistant — Claude Context

## What This Project Does

An arXiv research paper Q&A system. Users ask a natural-language question → the backend retrieves relevant paper chunks from ChromaDB → reranks them with Cohere → generates a cited answer using Groq (Llama 3) → the Next.js frontend displays the answer with source documents.

**Frontend status**: Streamlit UI exists and works (legacy, `ui/`). A Next.js frontend is being built in `frontend/` to replace it — see `docs/architecture.md` for the full design.

## Stack

- **Backend API**: FastAPI (`api/main.py`) — exposes RAG pipeline as HTTP — port 8000
- **RAG Pipeline**: `ui/pipeline.py` → `src/utils.py` (ChromaDB + Cohere + Groq/Ollama)
- **Legacy UI**: Streamlit (`ui/app.py`) — functional, being replaced
- **New Frontend**: Next.js 16.2.6 (App Router) in `frontend/` — TypeScript, Tailwind CSS v4, shadcn/ui, React 19
- **Vector DB**: ChromaDB (persistent, `chroma_db/`)
- **Embeddings**: `sentence-transformers/all-mpnet-base-v2`
- **Reranking**: Cohere `rerank-english-v3.0`
- **LLM**: Groq (`llama-3.1-70b-versatile`) for production; Ollama (local dev fallback)
- **Observability**: Langfuse (tracing all RAG steps)
- **Evaluation**: RAGAS (`faithfulness` metric, threshold 0.7) — CI gate in GitHub Actions
- **Package manager**: `uv` for Python, `npm` for Next.js

## Running Locally

### Step 1 — Environment variables
```bash
cp .env.example .env   # then fill in values
```
Required vars:
```
CO_API_KEY=...              # Cohere (reranking)
USE_GROQ=true
GROQ_API_KEY=...            # Groq (LLM generation)
LANGFUSE_PUBLIC_KEY=...     # Langfuse observability
LANGFUSE_SECRET_KEY=...
LANGFUSE_HOST=https://cloud.langfuse.com
```

### Step 2 — Install Python dependencies
```bash
uv sync
```

### Step 3 — Start FastAPI backend
```bash
uv run uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload
```
Health check: `curl http://localhost:8000/api/health`

### Step 4 — Start Next.js frontend
```bash
cd frontend
npm install
npm run dev   # http://localhost:3000
```

### Legacy Streamlit frontend (optional)
```bash
uv run streamlit run ui/app.py --server.port 8501
```

## Key Files

### Backend (FastAPI + RAG Core)
| File | Role |
|------|------|
| `api/main.py` | FastAPI app — `POST /api/query`, `GET /api/health`, `GET /api/evaluate/stream` |
| `ui/pipeline.py` | `run_pipeline(query, top_k, alpha, use_hybrid)` — called by FastAPI |
| `src/utils.py` | Core RAG functions: `retrieve_chroma`, `rerank_with_cohere`, `generate_answer_with_llama` |
| `ui/config.py` | `DEFAULT_TOP_K=5`, `DEFAULT_ALPHA=0.5`, `COLLECTION_NAME="ArxivPapers"` |
| `pyproject.toml` | Python dependencies (uv) |

### Next.js Frontend (`frontend/`)
| File | Role |
|------|------|
| `frontend/app/page.tsx` | Root page — tab routing (Ask / Evaluation) |
| `frontend/app/layout.tsx` | Root layout — fonts, metadata, theme |
| `frontend/app/globals.css` | Apple-inspired design tokens (CSS variables) |
| `frontend/components/layout/` | NavBar, Sidebar, TabNav |
| `frontend/components/ask/` | SearchBar, SampleQuestions, AnswerCard, SourceDocuments, SettingsPanel, QueryHistory |
| `frontend/components/evaluation/` | RunEvalButton, LogStream, ResultsTable, FaithfulnessScore |
| `frontend/lib/api.ts` | `queryRAG()`, `streamEvaluation()` fetch wrappers |
| `frontend/types/rag.ts` | TypeScript interfaces: QueryRequest, QueryResponse, DocumentResult |
| `frontend/.env.local` | `NEXT_PUBLIC_API_URL=http://localhost:8000` |

### Infrastructure
| File | Role |
|------|------|
| `chroma_db/` | Persistent vector index (tracked via Git LFS) |
| `dataset/arxiv_10k.json` | JSONL dataset — 10k arXiv papers |
| `evaluation/evaluate_rag.py` | RAGAS evaluation script — exits 1 if faithfulness < 0.7 |
| `.github/workflows/rag_eval.yml` | CI: runs evaluation on every push to main |

## Data Flow

```
POST /api/query { query, top_k, alpha, use_hybrid }
  → run_pipeline() in ui/pipeline.py
  → retrieve_chroma()       (ChromaDB vector search, top_k * 4 candidates)
  → rerank_with_cohere()    (Cohere rerank-english-v3.0, top_k final)
  → generate_answer_with_llama()  (Groq llama-3.1-70b-versatile)
  → { answer: str, documents: [...], latency_ms: float }
```

## API Endpoints

See `docs/api.md` for full request/response shapes.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/query` | Run RAG pipeline, return answer + docs |
| GET | `/api/evaluate/stream` | Stream evaluation logs (SSE) |
| GET | `/api/evaluation-results` | Return last evaluation CSV as JSON |

## Design System

The frontend follows Apple's Human Interface Guidelines adapted for web:
- Background: `#F5F5F7` (light) / `#000000` (dark)
- Text: `#1D1D1F` / `#F5F5F7`
- Accent: `#0071E3` (Apple blue)
- Font: `-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, system-ui`
- See `docs/design-system.md` for full token reference.

## Known Notes

- `chroma_db/` binary files use Git LFS (`.gitattributes` configured)
- Large dataset files (`arxiv-metadata-oai-snapshot.json`, `arxiv_100k.json`) are NOT in git — too large
- CORS in FastAPI is restricted to `localhost:3000` in development; update for production
- `frontend/` was scaffolded with `--no-src-dir` — no `src/` directory, paths are directly under `frontend/`
- Tailwind v4 uses `@import "tailwindcss"` in globals.css — no `tailwind.config.js` file needed
