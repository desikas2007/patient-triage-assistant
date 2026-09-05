"""
Local retriever for matching patient information to triage rules.
Uses NumPy for cosine similarity with Gemini embeddings.
"""
import json
import numpy as np
from pathlib import Path
from typing import List, Tuple, Optional

from backend.config import TRIAGE_RULES_JSON, TRIAGE_RULES_MD
from backend.ai.embeddings import get_embedding_manager


class LocalRetriever:
    """
    Local retriever using embeddings and cosine similarity.
    
    Architecture:
    - Load rules from local JSON/Markdown
    - Generate embeddings using Gemini gemini-embedding-001
    - Cache embeddings locally
    - Use NumPy for cosine similarity
    - Return top-k matching rules
    """
    
    def __init__(self, top_k: int = 5):
        """Initialize the retriever."""
        self.top_k = top_k
        self.embedding_manager = get_embedding_manager()
        self.rules: List[dict] = []
        self.rule_texts: List[str] = []
        self.rule_embeddings: Optional[np.ndarray] = None
        self._load_rules()
    
    def _load_rules(self) -> None:
        """Load rules from JSON file."""
        if TRIAGE_RULES_JSON.exists():
            with open(TRIAGE_RULES_JSON, "r") as f:
                data = json.load(f)
                self.rules = data.get("rules", [])
                # Create text representation for embedding
                self.rule_texts = [
                    self._rule_to_text(rule) for rule in self.rules
                ]
    
    def _rule_to_text(self, rule: dict) -> str:
        """Convert a rule to text for embedding."""
        parts = [
            f"Rule: {rule.get('title', '')}",
            f"Complaint: {rule.get('complaint', '')}",
            f"Urgency: {rule.get('urgency', '')}",
            f"Required information: {', '.join(rule.get('required_information', []))}",
            f"Red flags: {', '.join(rule.get('red_flags', []))}",
        ]
        return "\n".join(parts)
    
    async def build_index(self) -> None:
        """
        Build the embedding index.
        
        This is a placeholder that will be implemented in the next phase.
        """
        # TODO: Implement index building
        # 1. Check for cached embeddings
        # 2. If not cached, generate embeddings for all rules
        # 3. Save embeddings to cache
        # 4. Store as numpy array for similarity search
        raise NotImplementedError("Index building not yet implemented")
    
    async def search(
        self, 
        query: str, 
        top_k: Optional[int] = None
    ) -> List[Tuple[dict, float]]:
        """
        Search for relevant rules using cosine similarity.
        
        Args:
            query: Search query (e.g., structured patient facts)
            top_k: Number of results to return
            
        Returns:
            List of (rule, score) tuples sorted by relevance
        """
        if self.rule_embeddings is None:
            await self.build_index()
        
        # TODO: Implement search
        # 1. Generate query embedding
        # 2. Calculate cosine similarity with all rule embeddings
        # 3. Sort by score
        # 4. Return top-k results
        raise NotImplementedError("Search not yet implemented")


# Singleton instance
_retriever: Optional[LocalRetriever] = None


def get_retriever() -> LocalRetriever:
    """Get or create the retriever singleton."""
    global _retriever
    if _retriever is None:
        _retriever = LocalRetriever()
    return _retriever
