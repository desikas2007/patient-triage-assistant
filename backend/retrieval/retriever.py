"""
Local retriever for matching patient information to triage rules.
Uses NumPy cosine similarity with Gemini embeddings.
"""
import json
import numpy as np
import logging
from pathlib import Path
from typing import List, Tuple, Optional

from backend.config import TRIAGE_RULES_JSON, EMBEDDINGS_DIR
from backend.retrieval.index import EmbeddingIndex

logger = logging.getLogger(__name__)


class LocalRetriever:
    """
    Local retriever using embeddings and cosine similarity.

    - Loads rules from local JSON
    - Generates/caches embeddings using Gemini gemini-embedding-001
    - Uses NumPy for cosine similarity
    - Returns top-k matching rules
    """

    CACHE_NAME = "triage_rules"

    def __init__(self, top_k: int = 5, min_confidence: float = 0.3):
        self.top_k = top_k
        self.min_confidence = min_confidence
        self.index = EmbeddingIndex(name=self.CACHE_NAME)
        self.rules: List[dict] = []
        self.rule_texts: List[str] = []
        self._load_rules()

    def _load_rules(self) -> None:
        if TRIAGE_RULES_JSON.exists():
            with open(TRIAGE_RULES_JSON, "r") as f:
                data = json.load(f)
                self.rules = data.get("rules", [])
                self.rule_texts = [self._rule_to_text(rule) for rule in self.rules]

    def _rule_to_text(self, rule: dict) -> str:
        """Convert a rule to searchable text."""
        parts = [
            f"Rule {rule.get('rule_id', '')}: {rule.get('title', '')}",
            f"Complaint: {rule.get('complaint', '')}",
            f"Urgency: {rule.get('urgency', 'N/A')}",
            f"Department: {rule.get('department', 'N/A')}",
            f"Required information: {', '.join(rule.get('required_information', []))}",
            f"Red flags: {', '.join(rule.get('red_flags', []))}",
            f"Reasoning: {rule.get('reasoning', '')}",
        ]
        return "\n".join(parts)

    async def build_index(self) -> None:
        """Build or rebuild the embedding index."""
        from backend.ai.embeddings import get_embedding_manager

        if not self.rule_texts:
            logger.warning("No rules to index")
            return

        embedding_mgr = get_embedding_manager()
        logger.info(f"Generating embeddings for {len(self.rule_texts)} rules...")

        embeddings = await embedding_mgr.generate_embeddings(self.rule_texts)

        # Build metadata
        metadata = [
            {
                "rule_id": rule.get("rule_id", ""),
                "complaint": rule.get("complaint", ""),
                "urgency": rule.get("urgency", ""),
            }
            for rule in self.rules
        ]

        self.index.build(self.rule_texts, embeddings, metadata)
        embedding_mgr.save_cached_embeddings(self.CACHE_NAME, self.rule_texts, embeddings)
        logger.info(f"Index built with {len(self.rule_texts)} rules")

    async def ensure_index(self) -> None:
        """Load existing index or build a new one."""
        if self.index.load():
            logger.info("Loaded cached rule index")
            return

        # Try loading from the JSON cache (from EmbeddingManager)
        from backend.ai.embeddings import get_embedding_manager
        embedding_mgr = get_embedding_manager()
        cached = embedding_mgr.load_cached_embeddings(self.CACHE_NAME)
        if cached is not None:
            embeddings = np.array(cached["embeddings"], dtype=np.float32)
            metadata = [
                {
                    "rule_id": rule.get("rule_id", ""),
                    "complaint": rule.get("complaint", ""),
                }
                for rule in self.rules
            ]
            self.index.build(self.rule_texts, embeddings, metadata)
            logger.info("Built index from cached embeddings")
            return

        # Generate new embeddings
        await self.build_index()

    async def search(self, query: str, top_k: Optional[int] = None) -> List[Tuple[dict, float]]:
        """
        Search for relevant rules using cosine similarity.

        Returns list of (rule_dict, score) tuples sorted by relevance.
        """
        from backend.ai.embeddings import get_embedding_manager

        if self.index.embeddings is None:
            await self.ensure_index()

        if self.index.embeddings is None or len(self.index.embeddings) == 0:
            logger.warning("No index available for search")
            return []

        top_k = top_k or self.top_k

        # Generate query embedding
        embedding_mgr = get_embedding_manager()
        query_embedding = await embedding_mgr.generate_embedding(query)

        # Search
        results = self.index.search(query_embedding, top_k)

        # Map back to rules
        rule_map = {rule.get("rule_id"): rule for rule in self.rules}
        output = []
        for idx, score in results:
            if idx < len(self.rules):
                output.append((self.rules[idx], score))

        return output

    def get_relevant_rules_for_category(self, category: str) -> List[dict]:
        """Get all rules matching a complaint category (no embedding needed)."""
        return [
            rule for rule in self.rules
            if rule.get("complaint", "").lower() == category.lower()
        ]


# Singleton
_retriever: Optional[LocalRetriever] = None


def get_retriever() -> LocalRetriever:
    global _retriever
    if _retriever is None:
        _retriever = LocalRetriever()
    return _retriever
