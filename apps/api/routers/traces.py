from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, Header, BackgroundTasks
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..models import models
from ..schemas import schemas
from ..services.trace_processor import process_incoming_trace

router = APIRouter()

async def get_project_by_key(
    db: Session = Depends(get_db),
    x_api_key: str = Header(...),
) -> models.Project:
    project = db.query(models.Project).filter(models.Project.api_key == x_api_key).first()
    if not project:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return project

@router.post("/", response_model=schemas.Trace)
async def ingest_trace(
    *,
    db: Session = Depends(get_db),
    trace_in: schemas.TraceCreate,
    project: models.Project = Depends(get_project_by_key),
    background_tasks: BackgroundTasks,
):
    """
    Ingest a new trace with its spans.
    Processing is offloaded to background tasks for high ingestion performance.
    """
    # Quick validation and persistence
    trace = await process_incoming_trace(db, trace_in, project.id)
    
    # Trigger further analysis in background (Evaluations, Drift, etc.)
    # background_tasks.add_task(analyze_trace, trace.id)
    
    return trace

@router.get("/", response_model=List[schemas.Trace])
def read_traces(
    db: Session = Depends(get_db),
    project_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100,
):
    """
    Retrieve traces for a project.
    """
    query = db.query(models.Trace)
    if project_id:
        query = query.filter(models.Trace.project_id == project_id)
    traces = query.order_by(models.Trace.start_time.desc()).offset(skip).limit(limit).all()
    return traces

@router.get("/{trace_id}", response_model=schemas.TraceDetailed)
def read_trace(
    *,
    db: Session = Depends(get_db),
    trace_id: UUID,
):
    """
    Get deep trace details including all spans.
    """
    trace = db.query(models.Trace).filter(models.Trace.id == trace_id).first()
    if not trace:
        raise HTTPException(status_code=404, detail="Trace not found")
    return trace

@router.get("/{trace_id}/spans", response_model=List[schemas.Span])
def read_trace_spans(
    *,
    db: Session = Depends(get_db),
    trace_id: UUID,
):
    """
    Get all spans for a specific trace.
    """
    spans = db.query(models.Span).filter(models.Span.trace_id == trace_id).order_by(models.Span.start_time).all()
    return spans
