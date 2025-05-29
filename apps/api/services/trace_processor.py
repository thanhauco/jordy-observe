import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session
from loguru import logger

from ..models import models
from ..schemas import schemas

async def process_incoming_trace(
    db: Session, 
    trace_in: schemas.TraceCreate, 
    project_id: uuid.UUID
) -> models.Trace:
    """
    Core logic for ingesting and processing traces.
    Calculating latency, token counts, and costs at the trace level.
    """
    trace_id = trace_in.id or uuid.uuid4()
    
    # Create the trace object
    db_trace = models.Trace(
        id=trace_id,
        project_id=project_id,
        name=trace_in.name,
        session_id=trace_in.session_id,
        user_id=trace_in.user_id,
        start_time=trace_in.start_time,
        end_time=trace_in.end_time,
        input=trace_in.input,
        output=trace_in.output,
        metadata=trace_in.metadata,
        tags=trace_in.tags,
        status=models.TraceStatus.COMPLETED if trace_in.end_time else models.TraceStatus.RUNNING
    )
    
    db.add(db_trace)
    
    total_tokens = 0
    prompt_tokens = 0
    completion_tokens = 0
    total_cost = 0.0
    
    # Process spans
    for span_in in trace_in.spans:
        span_id = span_in.id or uuid.uuid4()
        
        # Calculate latency for the span
        latency = None
        if span_in.end_time and span_in.start_time:
            latency = (span_in.end_time - span_in.start_time).total_seconds() * 1000
            
        # Basic cost estimation logic (simplified)
        span_cost = 0.0
        if span_in.total_tokens:
            # Placeholder: 0.002 per 1k tokens
            span_cost = (span_in.total_tokens / 1000) * 0.002
            
        db_span = models.Span(
            id=span_id,
            trace_id=trace_id,
            parent_span_id=span_in.parent_span_id,
            name=span_in.name,
            span_type=span_in.span_type,
            start_time=span_in.start_time,
            end_time=span_in.end_time,
            latency_ms=latency,
            input=span_in.input,
            output=span_in.output,
            attributes=span_in.attributes,
            model=span_in.model,
            prompt_tokens=span_in.prompt_tokens,
            completion_tokens=span_in.completion_tokens,
            total_tokens=span_in.total_tokens,
            cost_usd=span_cost
        )
        
        db.add(db_span)
        
        # Aggregate metrics
        if span_in.total_tokens:
            total_tokens += span_in.total_tokens
        if span_in.prompt_tokens:
            prompt_tokens += span_in.prompt_tokens
        if span_in.completion_tokens:
            completion_tokens += span_in.completion_tokens
        total_cost += span_cost

    # Update trace with aggregated metrics
    db_trace.total_tokens = total_tokens
    db_trace.prompt_tokens = prompt_tokens
    db_trace.completion_tokens = completion_tokens
    db_trace.total_cost_usd = total_cost
    
    if db_trace.end_time and db_trace.start_time:
        db_trace.latency_ms = (db_trace.end_time - db_trace.start_time).total_seconds() * 1000
    
    try:
        db.commit()
        db.refresh(db_trace)
        return db_trace
    except Exception as e:
        db.rollback()
        logger.error(f"Error processing trace: {e}")
        raise
