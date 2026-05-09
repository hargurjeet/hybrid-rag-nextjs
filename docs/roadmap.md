# Project Roadmap — Next.js Frontend Migration

All phases build toward replacing the Streamlit UI (`ui/app.py`) with a professional Next.js frontend that follows Apple's Human Interface Guidelines.

Each phase ends with a `git push` and has a concrete validation checklist you can run yourself.

---

## Phase 1 — Documentation Foundation ✅
**Commit**: `docs: add CLAUDE.md and project documentation`

What was built:
- `CLAUDE.md` (repo root) — full project overview, local run instructions, env vars, file map
- `frontend/CLAUDE.md` — Next.js-specific conventions
- `docs/architecture.md` — system diagram and data flow
- `docs/design-system.md` — Apple HIG token reference
- `docs/api.md` — HTTP API endpoint reference

**Validation**: Open repo on GitHub — `CLAUDE.md` renders on homepage, `docs/` folder has 3 files.

---

## Phase 2 — FastAPI Backend Server ✅
**Commit**: `feat: add FastAPI server exposing RAG pipeline as HTTP API`

What was built:
- `api/main.py` — FastAPI app wrapping `run_pipeline()` from `ui/pipeline.py`
- `POST /api/query` — full RAG pipeline (retrieve → rerank → generate)
- `GET /api/health` — liveness check
- `GET /api/evaluate/stream` — SSE streaming for evaluation logs
- `GET /api/evaluation-results` — latest RAGAS results as JSON
- `.env.example` — template for required environment variables
- Added `fastapi`, `uvicorn[standard]`, `python-multipart` to `pyproject.toml`

**Validation**:
```bash
# 1. Copy env vars from hybrid_rag project
cp ../hybrid_rag/.env .env

# 2. Install deps
uv sync

# 3. Start server
uv run uvicorn api.main:app --host 0.0.0.0 --port 8000 --reload

# 4. Health check (no API keys needed)
curl http://localhost:8000/api/health
# → {"status":"ok"}

# 5. Full query (requires API keys in .env)
curl -X POST http://localhost:8000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is self-attention?", "top_k": 3}'
# → {"answer":"...","documents":[...],"latency_ms":...}

# 6. Interactive Swagger UI
open http://localhost:8000/docs
```

---

## Phase 3 — Design System & Global Styles 🔄
**Goal**: Install shadcn/ui and establish all Apple-inspired CSS tokens.

What will be built:
- shadcn/ui initialized with zinc base color
- Core shadcn components: `badge`, `button`, `card`, `separator`, `skeleton`, `tabs`, `slider`, `switch`, `tooltip`
- `frontend/app/globals.css` — full Apple design token set (colors, typography, spacing, radii, shadows, glass)
- `frontend/app/layout.tsx` — Inter font, updated metadata
- Placeholder page that shows the design system working

**Validation**: `npm run dev` → `localhost:3000` shows `#F5F5F7` background. Dark mode (OS toggle) → correct dark colors. `npm run build` passes.

---

## Phase 4 — Layout Shell & Navigation
**Goal**: Top nav, sidebar shell, two-tab segmented control.

What will be built:
- `frontend/components/layout/NavBar.tsx` — glass-effect top bar
- `frontend/components/layout/Sidebar.tsx` — glass panel, hosts settings + history
- `frontend/components/layout/TabNav.tsx` — Apple segmented control (Ask / Evaluation)
- `frontend/app/page.tsx` — two-column layout wired to tabs

**Validation**: Top nav renders. Tab switching works. Sidebar visible. No hydration errors.

---

## Phase 5 — Ask Tab: Query Interface
**Goal**: Search bar, sample questions, settings panel, query history, API call wired.

What will be built:
- `frontend/components/ask/SearchBar.tsx`
- `frontend/components/ask/SampleQuestions.tsx` (3 pill buttons)
- `frontend/components/ask/SettingsPanel.tsx` (top-k, alpha, retrieval mode, debug toggle)
- `frontend/components/ask/QueryHistory.tsx`
- `frontend/lib/api.ts` — `queryRAG()` fetch wrapper
- `frontend/types/rag.ts` — TypeScript interfaces

**Validation**: Click sample question → fills input. Submit → spinner shows, POST fires to `:8000/api/query`. History updates.

---

## Phase 6 — Ask Tab: Results Display
**Goal**: Answer card with markdown + citations, source document accordion, latency badge.

What will be built:
- `frontend/components/ask/AnswerCard.tsx` (react-markdown, citation highlighting)
- `frontend/components/ask/SourceDocuments.tsx` (accordion, score bar, category pills, arXiv link)
- `frontend/components/ask/LatencyBadge.tsx`
- `frontend/components/ask/DebugPanel.tsx`
- Skeleton loading states

**Validation**: Submit real query → answer renders with `[Document X]` citations visible. Source docs expand/collapse. Score bar shown.

---

## Phase 7 — Evaluation Tab
**Goal**: Run evaluation, stream logs live, display results with pass/fail.

What will be built:
- `frontend/components/evaluation/RunEvalButton.tsx`
- `frontend/components/evaluation/LogStream.tsx` (SSE via EventSource)
- `frontend/components/evaluation/ResultsTable.tsx`
- `frontend/components/evaluation/FaithfulnessScore.tsx` (PASS/FAIL badge)

**Validation**: Click "Run Evaluation" → logs stream line-by-line. After completion: table + faithfulness score + pass/fail badge appear.

---

## Phase 8 — Polish, Accessibility & Responsive
**Goal**: Production-quality finish.

What will be built:
- CSS enter animations on result cards
- Mobile-responsive sidebar (slide-over drawer on `< md`)
- Empty states (Ask tab before first query)
- Error toast for API failures
- `aria-label` on all interactive elements, keyboard navigation
- `npm run build` passes with zero errors

**Validation**: Mobile layout works. Disconnect backend → error message shown. Keyboard navigation through all controls. `npm run build` passes.
