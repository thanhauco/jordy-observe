from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..models import models
from ..schemas import schemas

router = APIRouter()

@router.get("/", response_model=List[schemas.Dataset])
def read_datasets(
    db: Session = Depends(get_db),
    project_id: Optional[UUID] = None,
    skip: int = 0,
    limit: int = 100,
):
    query = db.query(models.Dataset)
    if project_id:
        query = query.filter(models.Dataset.project_id == project_id)
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.Dataset)
def create_dataset(
    *,
    db: Session = Depends(get_db),
    dataset_in: schemas.DatasetCreate,
    project_id: UUID,
):
    db_obj = models.Dataset(**dataset_in.model_dump(), project_id=project_id)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.post("/{dataset_id}/items", response_model=schemas.DatasetItem)
def create_dataset_item(
    *,
    db: Session = Depends(get_db),
    dataset_id: UUID,
    item_in: schemas.DatasetItemCreate,
):
    dataset = db.query(models.Dataset).filter(models.Dataset.id == dataset_id).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    db_obj = models.DatasetItem(**item_in.model_dump(), dataset_id=dataset_id)
    db.add(db_obj)
    
    # Update item count
    dataset.item_count += 1
    db.add(dataset)
    
    db.commit()
    db.refresh(db_obj)
    return db_obj
