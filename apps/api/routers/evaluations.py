from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..models import models
from ..schemas import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Evaluation])
def read_evaluations(
    db: Session = Depends(get_db),
    trace_id: Optional[UUID] = None,
    span_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(models.Evaluation)
    if trace_id:
        query = query.filter(models.Evaluation.trace_id == trace_id)
    if span_id:
        query = query.filter(models.Evaluation.span_id == span_id)
    
    evals = query.offset(skip).limit(limit).all()
    return evals

@router.post("/", response_model=schemas.Evaluation)
def create_evaluation(
    *,
    db: Session = Depends(get_db),
    evaluation_in: schemas.EvaluationCreate,
):
    db_obj = models.Evaluation(**evaluation_in.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
