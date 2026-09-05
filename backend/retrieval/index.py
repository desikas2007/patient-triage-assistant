"""
Index management for vector embeddings.
Handles building, caching, and loading of embedding indexes.
"""
import json
import numpy as np
from pathlib import Path
from typing import List, Optional

from backend.config import EMBEDDINGS_DIR


class EmbeddingIndex:
    """
    Manages embedding indexes for fast retrieval.
    
    Index structure:
    - texts: List of original texts
    - embeddings: numpy array of shape (n_texts, embedding_dim)
    - metadata: Additional information about each text
    """
    
    def __init__(self, name: str = "triage_rules"):
        """Initialize the index."""
        self.name = name
        self.index_dir = EMBEDDINGS_DIR
        self.index_dir.mkdir(parents=True, exist_ok=True)
        
        self.texts: List[str] = []
        self.embeddings: Optional[np.ndarray] = None
        self.metadata: List[dict] = []
    
    @property
    def index_path(self) -> Path:
        """Path to the index file."""
        return self.index_dir / f"{self.name}.npz"
    
    @property
    def metadata_path(self) -> Path:
        """Path to the metadata file."""
        return self.index_dir / f"{self.name}_metadata.json"
    
    def exists(self) -> bool:
        """Check if the index exists."""
        return self.index_path.exists() and self.metadata_path.exists()
    
    def save(self) -> None:
        """Save the index to disk."""
        if self.embeddings is not None:
            np.savez_compressed(
                self.index_path,
                embeddings=self.embeddings
            )
        
        metadata = {
            "texts": self.texts,
            "metadata": self.metadata,
            "shape": list(self.embeddings.shape) if self.embeddings is not None else None,
        }
        with open(self.metadata_path, "w") as f:
            json.dump(metadata, f, indent=2)
    
    def load(self) -> bool:
        """Load the index from disk. Returns True if successful."""
        if not self.exists():
            return False
        
        try:
            data = np.load(self.index_path)
            self.embeddings = data["embeddings"]
            
            with open(self.metadata_path, "r") as f:
                metadata = json.load(f)
                self.texts = metadata.get("texts", [])
                self.metadata = metadata.get("metadata", [])
            
            return True
        except Exception:
            return False
    
    def build(
        self, 
        texts: List[str], 
        embeddings: np.ndarray,
        metadata: Optional[List[dict]] = None
    ) -> None:
        """Build the index with provided data."""
        self.texts = texts
        self.embeddings = embeddings
        self.metadata = metadata or [{} for _ in texts]
        self.save()
    
    def search(
        self, 
        query_embedding: np.ndarray, 
        top_k: int = 5
    ) -> List[tuple]:
        """
        Search the index using cosine similarity.
        
        Args:
            query_embedding: Query vector
            top_k: Number of results
            
        Returns:
            List of (index, score) tuples
        """
        if self.embeddings is None or len(self.embeddings) == 0:
            return []
        
        # Normalize vectors for cosine similarity
        query_norm = query_embedding / np.linalg.norm(query_embedding)
        embeddings_norm = self.embeddings / np.linalg.norm(
            self.embeddings, axis=1, keepdims=True
        )
        
        # Calculate cosine similarity
        similarities = np.dot(embeddings_norm, query_norm)
        
        # Get top-k indices
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        return [(int(idx), float(similarities[idx])) for idx in top_indices]
