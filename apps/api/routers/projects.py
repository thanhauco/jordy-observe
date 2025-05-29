from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..models import models
from ..schemas import schemas
from ..core.config import settings

router = APIRouter()

@router.get("/", response_model=List[schemas.Project])
def read_projects(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    organization_id: Optional[UUID] = None,
):
    """
    Retrieve projects.
    """
    query = db.query(models.Project)
    if organization_id:
        query = query.filter(models.Project.organization_id == organization_id)
    projects = query.offset(skip).limit(limit).all()
    return projects

@router.post("/", response_model=schemas.Project)
def create_project(
    *,
    db: Session = Depends(get_db),
    project_in: schemas.ProjectCreate,
    organization_id: UUID,  # In real app, get from current user
):
    """
    Create new project.
    """
    import secrets
    
    # Check if slug exists
    project = db.query(models.Project).filter(
        models.Project.organization_id == organization_id,
        models.Project.slug == project_in.slug
    ).first()
    if project:
        raise HTTPException(
            status_code=400,
            detail="A project with this slug already exists in this organization.",
        )
    
    db_obj = models.Project(
        **project_in.model_dump(),
        organization_id=organization_id,
        api_key=f"jo_{secrets.token_urlsafe(32)}"
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/{project_id}", response_model=schemas.Project)
def read_project(
    *,
    db: Session = Depends(get_db),
    project_id: UUID,
):
    """
    Get project by ID.
    """
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=schemas.Project)
def update_project(
    *,
    db: Session = Depends(get_db),
    project_id: UUID,
    project_in: schemas.ProjectUpdate,
):
    """
    Update a project.
    """
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = project_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)
    
    db.add(project)
    db.commit()
    db.refresh(project)
    return project
