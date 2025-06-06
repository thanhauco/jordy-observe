from qdrant_client import QdrantClient
from .config import settings

qdrant_client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
