"""
Index management for vector embeddings.
Handles building, caching, and loading of embedding indexes.
"""
import json
import numpy as np
import logging
from pathlib import Path
from typing import List, Optional

from backend.config import EMBEDDINGS_DIR

logger = logging.getLogger(__name__)


class EmbeddingIndex:
    """
    Manages embedding indexes for fast retrieval.

    Index structure:
    - texts: List of original texts
    - embeddings: numpy array of shape (n_texts, embedding_dim)
    - metadata: Additional information about each text (rule_ids, etc.)
    """

    def __init__(self, name: str = "triage_rules"):
        self.name = name
        self.index_dir = EMBEDDINGS_DIR
        self.index_dir.mkdir(parents=True, exist_ok=True)

        self.texts: List[str] = []
        self.embeddings: Optional[np.ndarray] = None
        self.metadata: List[dict] = []

    @property
    def index_path(self) -> Path:
        return self.index_dir / f"{self.name}.npz"

    @property
    def metadata_path(self) -> Path:
        return self.index_dir / f"{self.name}_metadata.json"

    def exists(self) -> bool:
        return self.index_path.exists() and self.metadata_path.exists()

    def save(self) -> None:
        if self.embeddings is not None:
            np.savez_compressed(self.index_path, embeddings=self.embeddings)

        metadata = {
            "texts": self.texts,
            "metadata": self.metadata,
            "shape": list(self.embeddings.shape) if self.embeddings is not None else None,
        }
        with open(self.metadata_path, "w") as f:
            json.dump(metadata, f, indent=2)
        logger.info(f"Saved index with {len(self.texts)} entries")

    def load(self) -> bool:
        if not self.exists():
            return False
        try:
            data = np.load(self.index_path)
            self.embeddings = data["embeddings"]

            with open(self.metadata_path, "r") as f:
                metadata = json.load(f)
                self.texts = metadata.get("texts", [])
                self.metadata = metadata.get("metadata", [])

            logger.info(f"Loaded index with {len(self.texts)} entries")
            return True
        except Exception as e:
            logger.warning(f"Failed to load index: {e}")
            return False

    def build(self, texts: List[str], embeddings: np.ndarray, metadata: Optional[List[dict]] = None) -> None:
        self.texts = texts
        self.embeddings = embeddings
        self.metadata = metadata or [{} for _ in texts]
        self.save()

    def search(self, query_embedding: np.ndarray, top_k: int = 5) -> List[tuple]:
        """Search using cosine similarity. Returns list of (index, score)."""
        if self.embeddings is None or len(self.embeddings) == 0:
            return []

        # Normalize
        query_norm = query_embedding / np.linalg.norm(query_embedding)
        embeddings_norm = self.embeddings / np.linalg.norm(self.embeddings, axis=1, keepdims=True)

        similarities = np.dot(embeddings_norm, query_norm)
        top_indices = np.argsort(similarities)[::-1][:top_k]

        return [(int(idx), float(similarities[idx])) for idx in top_indices]
