import qdrant_client
from qdrant_client.http import models as q_models
from ..core.config import settings
from loguru import logger
from typing import List, Dict, Any, Optional

class VectorService:
    """
    Manages vector storage and semantic search using Qdrant.
    Used for finding similar traces and searching datasets.
    """
    
    def __init__(self):
        try:
            self.client = qdrant_client.QdrantClient(
                host=settings.QDRANT_HOST,
                port=settings.QDRANT_PORT
            )
        except Exception as e:
            logger.error(f"Failed to connect to Qdrant: {e}")
            self.client = None

    def ensure_collection(self, collection_name: str, vector_size: int = 1536):
        """
        Creates collection if it doesn't exist.
        Default 1536 is for OpenAI embeddings.
        """
        if not self.client: return
        
        collections = self.client.get_collections().collections
        exists = any(c.name == collection_name for c in collections)
        
        if not exists:
            self.client.recreate_collection(
                collection_name=collection_name,
                vectors_config=q_models.VectorParams(
                    size=vector_size,
                    distance=q_models.Distance.COSINE
                )
            )
            logger.info(f"Created Qdrant collection: {collection_name}")

    def upsert_embedding(
        self, 
        collection_name: str, 
        point_id: str, 
        vector: List[float], 
        payload: Dict[str, Any]
    ):
        if not self.client: return
        
        self.client.upsert(
            collection_name=collection_name,
            points=[
                q_models.PointStruct(
                    id=point_id,
                    vector=vector,
                    payload=payload
                )
            ]
        )

    def search_similar(
        self, 
        collection_name: str, 
        query_vector: List[float], 
        limit: int = 5,
        score_threshold: float = 0.7
    ) -> List[Dict[str, Any]]:
        if not self.client: return []
        
        results = self.client.search(
            collection_name=collection_name,
            query_vector=query_vector,
            limit=limit,
            score_threshold=score_threshold,
            with_payload=True
        )
        
        return [
            {"id": hit.id, "score": hit.score, "payload": hit.payload}
            for hit in results
        ]
