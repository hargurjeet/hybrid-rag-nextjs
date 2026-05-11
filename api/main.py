import os
import sys
import time
import json
import subprocess
import asyncio
from pathlib import Path

# ── path setup ────────────────────────────────────────────────────────────────
# ROOT is the repo root (parent of this api/ directory)
ROOT = Path(__file__).resolve().parent.parent

# Add repo root so `from src.utils import ...` works inside pipeline.py
sys.path.insert(0, str(ROOT))

# Add ui/ so `from config import COLLECTION_NAME` resolves to ui/config.py
sys.path.insert(0, str(ROOT / "ui"))

# ── imports ───────────────────────────────────────────────────────────────────
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import pandas as pd

load_dotenv(ROOT / ".env")

# pipeline is imported lazily inside the /api/query handler so the server
# can start (and serve /api/health) even when API keys are not yet configured.

# ── paper dataset cache ───────────────────────────────────────────────────────
_papers_cache: list[dict] | None = None


def _load_papers() -> list[dict]:
    global _papers_cache
    if _papers_cache is not None:
        return _papers_cache
    path = ROOT / "dataset" / "arxiv_10k.json"
    try:
        papers = []
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                r = json.loads(line)
                authors = r.get("authors", "")
                papers.append({
                    "paper_id": r["id"],
                    "title": r.get("title", "").replace("\n", " ").strip(),
                    "categories": r.get("categories", ""),
                    "authors_preview": authors[:77] + "…" if len(authors) > 80 else authors,
                })
        _papers_cache = papers
        return papers
    except FileNotFoundError:
        raise HTTPException(status_code=503, detail="Dataset not available")


# ── app ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Hybrid RAG Research Assistant API",
    description="RAG pipeline over arXiv papers: ChromaDB + Cohere + Groq",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

# ── schemas ───────────────────────────────────────────────────────────────────
class ChatHistoryItem(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    content: str = Field(..., min_length=1)


class QueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Research question")
    top_k: int = Field(5, ge=1, le=10, description="Number of documents to return")
    alpha: float = Field(0.5, ge=0.0, le=1.0, description="Hybrid search blend weight")
    use_hybrid: bool = Field(True, description="Whether to use hybrid retrieval")
    chat_history: list[ChatHistoryItem] = Field(
        default_factory=list,
        description="Previous conversation turns (user/assistant) before this query",
    )
    paper_ids: list[str] = Field(
        default_factory=list,
        description="Optional list of paper IDs to restrict retrieval to",
    )


class DocumentResult(BaseModel):
    paper_id: str
    title: str | None
    categories: str | None
    text: str
    score: float | None


class QueryResponse(BaseModel):
    answer: str
    documents: list[DocumentResult]
    latency_ms: float


class PaperSummary(BaseModel):
    paper_id: str
    title: str
    categories: str
    authors_preview: str


# ── endpoints ─────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    """Liveness check — confirms server is up and pipeline imports succeeded."""
    return {"status": "ok"}


@app.get("/api/papers", response_model=list[PaperSummary])
def search_papers(q: str = "", limit: int = 20):
    """Search papers by title or category (case-insensitive substring match)."""
    limit = min(limit, 50)
    papers = _load_papers()
    if not q.strip():
        return papers[:limit]
    q_lower = q.lower()
    results = []
    for p in papers:
        if q_lower in p["title"].lower() or q_lower in p["categories"].lower():
            results.append(p)
            if len(results) >= limit:
                break
    return results


@app.post("/api/query", response_model=QueryResponse)
def query(req: QueryRequest):
    """
    Run the full RAG pipeline for a research question.

    Steps: ChromaDB vector retrieval → Cohere reranking → Groq answer generation.
    """
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="query cannot be empty")

    # Lazy import so the server starts cleanly without env vars configured
    try:
        from pipeline import run_pipeline  # ui/pipeline.py (ui/ is on sys.path)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Pipeline init error: {exc}") from exc

    t0 = time.time()
    try:
        answer, docs = run_pipeline(
            query=req.query,
            top_k=req.top_k,
            alpha=req.alpha,
            use_hybrid=req.use_hybrid,
            chat_history=[h.model_dump() for h in req.chat_history],
            paper_ids=req.paper_ids,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Pipeline error: {exc}") from exc

    latency_ms = (time.time() - t0) * 1000

    documents = [
        DocumentResult(
            paper_id=str(d.get("paper_id") or ""),
            title=d.get("title"),
            categories=d.get("categories"),
            text=str(d.get("text") or ""),
            score=float(d["score"]) if d.get("score") is not None else None,
        )
        for d in docs
    ]

    return QueryResponse(answer=answer, documents=documents, latency_ms=round(latency_ms, 1))


@app.get("/api/evaluate/stream")
async def evaluate_stream():
    """
    Run evaluation/evaluate_rag.py as a subprocess and stream stdout via SSE.

    Each line of subprocess output is emitted as an SSE `data:` event.
    The final event is always `data: [DONE]`.
    """
    eval_script = str(ROOT / "evaluation" / "evaluate_rag.py")

    async def event_generator():
        process = await asyncio.create_subprocess_exec(
            sys.executable,
            eval_script,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.STDOUT,
            cwd=str(ROOT),
        )
        async for line in process.stdout:
            text = line.decode("utf-8", errors="replace").rstrip()
            if text:
                yield f"data: {text}\n\n"
        await process.wait()
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/api/evaluation-results")
def evaluation_results():
    """Return the most recent RAGAS evaluation results from rag_evaluation_results.csv."""
    csv_path = ROOT / "rag_evaluation_results.csv"
    if not csv_path.exists():
        raise HTTPException(
            status_code=404,
            detail="No evaluation results found. Run evaluation first.",
        )

    df = pd.read_csv(csv_path)
    records = df.to_dict(orient="records")

    # RAGAS writes faithfulness as a column; gracefully handle missing
    faithfulness_col = [
        r.get("faithfulness") for r in records if r.get("faithfulness") is not None
    ]
    import numpy as np
    avg = float(np.nanmean(faithfulness_col)) if faithfulness_col else None
    threshold = float(os.getenv("FAITHFULNESS_THRESHOLD", "0.7"))

    return {
        "results": records,
        "avg_faithfulness": round(avg, 4) if avg is not None else None,
        "passed": (avg >= threshold) if avg is not None else None,
        "threshold": threshold,
    }
