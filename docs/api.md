# API Reference

FastAPI backend runs on `http://localhost:8000` in development.

All endpoints are under the `/api` prefix.

---

## GET `/api/health`

Health check — verify the server is running and the ChromaDB collection is loaded.

**Response**
```json
{
  "status": "ok",
  "collection_count": 15423
}
```

---

## POST `/api/query`

Run the full RAG pipeline for a user question.

**Request body**
```json
{
  "query": "What are multidimension recurrent neural networks?",
  "top_k": 5,
  "alpha": 0.5,
  "use_hybrid": true
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `query` | string | ✅ | — | Natural language research question |
| `top_k` | integer | ❌ | 5 | Number of final documents to return (1–10) |
| `alpha` | float | ❌ | 0.5 | Hybrid search blend (0 = BM25, 1 = vector) — reserved for future use |
| `use_hybrid` | boolean | ❌ | true | Whether to use hybrid retrieval — reserved for future use |

**Response `200 OK`**
```json
{
  "answer": "Multidimensional recurrent neural networks extend standard RNNs to operate over multi-dimensional data [Document 1]. They process sequences along multiple axes simultaneously [Document 2].",
  "documents": [
    {
      "paper_id": "0705.2011",
      "title": "Multi-Dimensional Recurrent Neural Networks",
      "categories": "cs.NE, cs.LG",
      "text": "We present multi-dimensional recurrent neural networks (MDRNNs)...",
      "score": 0.9823
    }
  ],
  "latency_ms": 2341.7
}
```

| Field | Type | Description |
|-------|------|-------------|
| `answer` | string | LLM-generated answer with inline citations like `[Document 1]` |
| `documents` | array | Reranked source documents used as context |
| `documents[].paper_id` | string | arXiv paper identifier (e.g. `0705.2011`) |
| `documents[].title` | string | Paper title |
| `documents[].categories` | string | Comma-separated arXiv categories (e.g. `cs.LG, cs.AI`) |
| `documents[].text` | string | The specific chunk text from the paper |
| `documents[].score` | float | Cohere relevance score (0–1, higher is more relevant) |
| `latency_ms` | float | Total pipeline latency in milliseconds |

**Error responses**

| Status | Body | Cause |
|--------|------|-------|
| `400` | `{"detail": "query cannot be empty"}` | Empty query string |
| `500` | `{"detail": "Pipeline error: ..."}` | Backend exception (LLM timeout, ChromaDB error, etc.) |

---

## GET `/api/evaluate/stream`

Run the RAGAS evaluation pipeline and stream stdout as Server-Sent Events (SSE).

Runs `evaluation/evaluate_rag.py` as a subprocess and streams each line of output as an SSE event.

**Response** — `text/event-stream`

```
data: Evaluating: What are multidimension recurrent neural networks?
data: Evaluating: What bottom friction model is used...
data: Starting RAGAS Evaluation...
data: Average Faithfulness Score: 0.82
data: ✅ Faithfulness above threshold
data: [DONE]
```

The final event is always `data: [DONE]` — the frontend uses this to detect completion.

**Error** — if the subprocess exits with code 1 (evaluation failed):
```
data: ❌ Faithfulness below threshold
data: ❌ Evaluation failed
data: [DONE]
```

---

## GET `/api/evaluation-results`

Return the most recent evaluation results from `rag_evaluation_results.csv`.

**Response `200 OK`** — if results file exists:
```json
{
  "results": [
    {
      "question": "What are multidimension recurrent neural networks?",
      "ground_truth": "...",
      "answer": "...",
      "faithfulness": 0.85
    }
  ],
  "avg_faithfulness": 0.82,
  "passed": true,
  "threshold": 0.7
}
```

**Response `404`** — if no results file exists yet:
```json
{
  "detail": "No evaluation results found. Run evaluation first."
}
```

---

## CORS

In development, CORS is configured to allow:
- Origin: `http://localhost:3000`
- Methods: `GET, POST, OPTIONS`
- Headers: `Content-Type`

Update `api/main.py` CORS origins for production deployment.
