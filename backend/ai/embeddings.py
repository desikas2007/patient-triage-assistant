"""
Embedding generation module for Patient Intake Triage Assistant.
Uses Gemini gemini-embedding-001 for local vector operations.
"""
import json
import numpy as np
from pathlib import Path
from typing import List, Optional

from backend.config import GEMINI_API_KEY, GEMINI_EMBEDDING_MODEL, EMBEDDINGS_DIR


class EmbeddingManager:
    """Manages embedding generation and caching."""
    
    def __init__(self):
        """Initialize the embedding manager."""
        self.model = GEMINI_EMBEDDING_MODEL
        self.cache_dir = EMBEDDINGS_DIR
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self._client = None
    
    @property
    def client(self):
        """Lazy-load the Gemini client."""
        if self._client is None:
            if not GEMINI_API_KEY:
                raise ValueError("GEMINI_API_KEY environment variable is required")
            from google import genai
            self._client = genai.Client(api_key=GEMINI_API_KEY)
        return self._client
    
    async def generate_embedding(self, text: str) -> np.ndarray:
        """
        Generate embedding for a single text.
        
        Args:
            text: Text to embed
            
        Returns:
            Embedding vector as numpy array
        """
        # TODO: Implement actual embedding generation
        raise NotImplementedError("Embedding generation not yet implemented")
    
    async def generate_embeddings(self, texts: List[str]) -> List[np.ndarray]:
        """
        Generate embeddings for multiple texts.
        
        Args:
            texts: List of texts to embed
            
        Returns:
            List of embedding vectors
        """
        # TODO: Implement batch embedding generation
        raise NotImplementedError("Batch embedding generation not yet implemented")
    
    def load_cached_embeddings(self, name: str) -> Optional[dict]:
        """Load cached embeddings from disk."""
        cache_file = self.cache_dir / f"{name}.json"
        if cache_file.exists():
            with open(cache_file, "r") as f:
                data = json.load(f)
                # Convert lists back to numpy arrays
                data["embeddings"] = [np.array(e) for e in data["embeddings"]]
                return data
        return None
    
    def save_cached_embeddings(self, name: str, texts: List[str], embeddings: List[np.ndarray]) -> None:
        """Save embeddings to cache."""
        cache_file = self.cache_dir / f"{name}.json"
        data = {
            "texts": texts,
            "embeddings": [e.tolist() for e in embeddings],
            "model": self.model,
        }
        with open(cache_file, "w") as f:
            json.dump(data, f, indent=2)


# Singleton instance
_embedding_manager: Optional[EmbeddingManager] = None


def get_embedding_manager() -> EmbeddingManager:
    """Get or create the embedding manager singleton."""
    global _embedding_manager
    if _embedding_manager is None:
        _embedding_manager = EmbeddingManager()
    return _embedding_manager
