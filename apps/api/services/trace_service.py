from sqlalchemy.orm import Session
from ..models import models
from ..schemas import schemas
import uuid
from datetime import datetime

class TraceService:
    @staticmethod
    def create_trace(db: Session, project_id: uuid.UUID, trace_data: schemas.TraceCreate):
        db_trace = models.Trace(
            id=uuid.uuid4(),
            project_id=project_id,
            status="running",
            start_time=datetime.utcnow(),
            input=trace_data.input,
            output=trace_data.output
        )
        db.add(db_trace)
        
        span_id_map = {}
        for span_data in trace_data.spans:
            span_id = span_data.id or uuid.uuid4()
            db_span = models.Span(
                id=span_id,
                trace_id=db_trace.id,
                parent_span_id=span_id_map.get(span_data.parent_span_id),
                name=span_data.name,
                span_type=span_data.span_type,
                start_time=datetime.utcnow(),
                input=span_data.input,
                output=span_data.output
            )
            db.add(db_span)
            if span_data.id:
                span_id_map[span_data.id] = span_id
        
        db.commit()
        db.refresh(db_trace)
        return db_trace
