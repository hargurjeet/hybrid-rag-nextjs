---
title: Hybrid RAG Research Assistant
emoji: 🔬
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# Hybrid RAG Research Assistant

A conversational research assistant that searches across 10,000 arXiv papers using a hybrid retrieval approach (BM25 + dense vector search), Cohere reranking, and Groq (Llama 3) for answer generation.

## Features

- **Hybrid retrieval**: Combines BM25 keyword search with dense semantic vectors for more relevant results
- **Cohere reranking**: Re-scores candidates using a cross-encoder for precision
- **Multi-turn chat**: Ask follow-up questions in the same conversation
- **Source documents**: Each answer cites the specific papers it drew from
- **Evaluation tab**: Run RAGAS faithfulness evaluation against the live pipeline

## Stack

- **Backend**: FastAPI + ChromaDB + Cohere + Groq (Llama 3.1 70B)
- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, shadcn/ui
- **Dataset**: 10,000 arXiv papers (astro-ph, hep-th, hep-ph, quant-ph, gr-qc, cond-mat)
