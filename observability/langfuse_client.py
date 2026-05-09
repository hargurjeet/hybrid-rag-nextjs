from langfuse import Langfuse

langfuse = Langfuse()

def start_trace(name, user_id="rag-user"):
    return langfuse.start_trace(
        name=name,
        user_id=user_id,
        metadata={
        "env": "local",
        "retriever": "hybrid",
        "reranker": "bge-large",
        "llm": "llama3.2"
        }
    )