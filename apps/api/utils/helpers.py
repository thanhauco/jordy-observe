import uuid
from datetime import datetime

def generate_api_key() -> str:
    return f"jo_{uuid.uuid4().hex[:24]}"

def utc_now() -> datetime:
    return datetime.utcnow()
