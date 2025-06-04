import requests
import uuid
import time
from datetime import datetime
from typing import Any, Dict, List, Optional
from contextlib import contextmanager

class Span:
    def __init__(self, name: str, span_type: str = "custom", parent: Optional["Span"] = None):
        self.id = uuid.uuid4()
        self.name = name
        self.span_type = span_type
        self.parent = parent
        self.start_time = datetime.utcnow()
        self.end_time: Optional[datetime] = None
        self.input: Optional[Dict[str, Any]] = None
        self.output: Optional[Dict[str, Any]] = None
        self.attributes: Dict[str, Any] = {}
        self.model: Optional[str] = None
        self.tokens: Dict[str, int] = {}

    def log_input(self, input_data: Dict[str, Any]):
        self.input = input_data

    def log_output(self, output_data: Dict[str, Any]):
        self.output = output_data

    def set_attribute(self, key: str, value: Any):
        self.attributes[key] = value

    def set_llm_metadata(self, model: str, prompt_tokens: int = 0, completion_tokens: int = 0):
        self.model = model
        self.tokens = {
            "prompt": prompt_tokens,
            "completion": completion_tokens,
            "total": prompt_tokens + completion_tokens
        }

    def end(self):
        self.end_time = datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": str(self.id),
            "name": self.name,
            "span_type": self.span_type,
            "parent_span_id": str(self.parent.id) if self.parent else None,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "input": self.input,
            "output": self.output,
            "attributes": self.attributes,
            "model": self.model,
            "prompt_tokens": self.tokens.get("prompt"),
            "completion_tokens": self.tokens.get("completion"),
            "total_tokens": self.tokens.get("total")
        }

class Trace:
    def __init__(self, client: "JordyClient", name: str):
        self.client = client
        self.id = uuid.uuid4()
        self.name = name
        self.start_time = datetime.utcnow()
        self.end_time: Optional[datetime] = None
        self.spans: List[Span] = []
        self.active_span: Optional[Span] = None
        self.input: Optional[Dict[str, Any]] = None
        self.output: Optional[Dict[str, Any]] = None

    @contextmanager
    def span(self, name: str, span_type: str = "custom"):
        parent = self.active_span
        span = Span(name, span_type, parent=parent)
        self.spans.append(span)
        
        previous_span = self.active_span
        self.active_span = span
        try:
            yield span
        finally:
            span.end()
            self.active_span = previous_span

    def set_input(self, input_data: Dict[str, Any]):
        self.input = input_data

    def set_output(self, output_data: Dict[str, Any]):
        self.output = output_data

    def end(self):
        self.end_time = datetime.utcnow()
        # Automatically send to client
        self.client.ingest_trace(self)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": str(self.id),
            "name": self.name,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "input": self.input,
            "output": self.output,
            "spans": [s.to_dict() for s in self.spans]
        }

class JordyClient:
    def __init__(self, api_key: str, base_url: str = "http://localhost:8000"):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({
            "X-API-KEY": self.api_key,
            "Content-Type": "application/json"
        })

    def trace(self, name: str) -> Trace:
        return Trace(self, name)

    @contextmanager
    def start_trace(self, name: str):
        t = Trace(self, name)
        try:
            yield t
        finally:
            t.end()

    def ingest_trace(self, trace: Trace):
        try:
            url = f"{self.base_url}/api/v1/traces/"
            response = self.session.post(url, json=trace.to_dict(), timeout=5)
            response.raise_for_status()
        except Exception as e:
            # In production, use background worker or async logging to not block app
            print(f"Failed to ingest trace to Jordy Observe: {e}")
