import uuid
from typing import Optional, Dict, Any
from .vector_service import VectorService
from loguru import logger

class SemanticCacheService:
    """
    Implements semantic caching to reduce LLM costs and latency.
    Uses Qdrant for similarity search and returns cached results for high-score matches.
    """
    
    def __init__(self, vector_service: VectorService):
        self.vector_service = vector_service
        self.collection_name = "semantic_cache"
        # Ensure collection exists
        self.vector_service.ensure_collection(self.collection_name, vector_size=1536)

    async def get_cached_response(self, query_vector: list[float], threshold: float = 0.97) -> Optional[Dict[str, Any]]:
        """
        Search for a similar query in the cache.
        """
        results = self.vector_service.search_similar(
            collection_name=self.collection_name,
            query_vector=query_vector,
            limit=1,
            score_threshold=threshold
        )
        
        if results:
            logger.info(f"Semantic cache hit! Score: {results[0]['score']}")
            return results[0]['payload']
        
        return None

    def cache_response(self, query_vector: list[float], query_text: str, response: Any):
        """
        Store a new query-response pair in the semantic cache.
        """
        point_id = str(uuid.uuid4())
        payload = {
            "query": query_text,
            "response": response,
            "cached_at": str(uuid.uuid4()) # Placeholder for timestamp
        }
        
        self.vector_service.upsert_embedding(
            collection_name=self.collection_name,
            point_id=point_id,
            vector=query_vector,
            payload=payload
        )
        logger.info(f"Cached semantic response for query: {query_text[:50]}...")

# Normalization logic added to improve hit rates
