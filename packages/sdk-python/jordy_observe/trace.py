from typing import Optional, Dict, Any, List
from datetime import datetime
import uuid

class Span:
    def __init__(self, trace: "Trace", name: str, span_type: str = "generic", parent: Optional["Span"] = None):
        self.id = uuid.uuid4()
        self.trace = trace
        self.name = name
        self.span_type = span_type
        self.parent = parent
        self.input_data: Optional[Dict[str, Any]] = None
        self.output_data: Optional[Dict[str, Any]] = None
        self.start_time = datetime.utcnow()
        self.end_time: Optional[datetime] = None
    
    def log_input(self, data: Dict[str, Any]):
        self.input_data = data
    
    def log_output(self, data: Dict[str, Any]):
        self.output_data = data
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.end_time = datetime.utcnow()
        self.trace._spans.append(self)
    
    def to_dict(self) -> dict:
        return {
            "id": str(self.id),
            "name": self.name,
            "span_type": self.span_type,
            "parent_span_id": str(self.parent.id) if self.parent else None,
            "input": self.input_data,
            "output": self.output_data,
        }

class Trace:
    def __init__(self, client, name: str):
        self.client = client
        self.name = name
        self._spans: List[Span] = []
        self.start_time = datetime.utcnow()
    
    def span(self, name: str, span_type: str = "generic", parent: Optional[Span] = None) -> Span:
        return Span(trace=self, name=name, span_type=span_type, parent=parent)
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        trace_data = {
            "input": {"trace_name": self.name},
            "output": {},
            "spans": [span.to_dict() for span in self._spans]
        }
        self.client.send_trace(trace_data)
