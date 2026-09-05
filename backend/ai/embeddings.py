"""
Embedding generation module for Patient Intake Triage Assistant.
Uses Gemini gemini-embedding-001 for local vector operations.
"""
import json
import numpy as np
import logging
from pathlib import Path
from typing import List, Optional

from backend.config import GEMINI_API_KEY, GEMINI_EMBEDDING_MODEL, EMBEDDINGS_DIR

logger = logging.getLogger(__name__)


class EmbeddingManager:
    """Manages embedding generation and caching."""

    def __init__(self):
        self.model = GEMINI_EMBEDDING_MODEL
        self.cache_dir = EMBEDDINGS_DIR
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self._client = None

    @property
    def client(self):
        if self._client is None:
            if not GEMINI_API_KEY:
                raise ValueError("GEMINI_API_KEY environment variable is required for embeddings")
            from google import genai
            self._client = genai.Client(api_key=GEMINI_API_KEY)
        return self._client

    async def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for a list of texts using Gemini gemini-embedding-001.

        Returns a numpy array of shape (len(texts), embedding_dim).
        """
        from google.genai import types

        try:
            # Gemini supports batch embedding via embed_content with multiple texts
            result = await self.client.aio.models.embed_content(
                model=self.model,
                contents=texts,
                config=types.EmbedContentConfig(
                    output_dimensionality=768,
                ),
            )
            # result.embeddings is a list of ContentEmbedding objects
            embeddings = [e.values for e in result.embeddings]
            return np.array(embeddings, dtype=np.float32)
        except Exception as e:
            logger.error(f"Embedding generation failed: {e}")
            raise RuntimeError(f"Embedding generation failed: {type(e).__name__}")

    async def generate_embedding(self, text: str) -> np.ndarray:
        """Generate embedding for a single text."""
        result = await self.generate_embeddings([text])
        return result[0]

    def load_cached_embeddings(self, name: str) -> Optional[dict]:
        """Load cached embeddings from disk."""
        cache_file = self.cache_dir / f"{name}.json"
        if cache_file.exists():
            try:
                with open(cache_file, "r") as f:
                    data = json.load(f)
                data["embeddings"] = [np.array(e, dtype=np.float32) for e in data["embeddings"]]
                return data
            except Exception as e:
                logger.warning(f"Failed to load cached embeddings: {e}")
                return None
        return None

    def save_cached_embeddings(self, name: str, texts: List[str], embeddings: np.ndarray) -> None:
        """Save embeddings to cache."""
        cache_file = self.cache_dir / f"{name}.json"
        data = {
            "texts": texts,
            "embeddings": [e.tolist() for e in embeddings],
            "model": self.model,
        }
        with open(cache_file, "w") as f:
            json.dump(data, f)
        logger.info(f"Saved {len(texts)} embeddings to {cache_file}")


# Singleton
_embedding_manager: Optional[EmbeddingManager] = None


def get_embedding_manager() -> EmbeddingManager:
    global _embedding_manager
    if _embedding_manager is None:
        _embedding_manager = EmbeddingManager()
    return _embedding_manager
