from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..core.database import get_db
from ..models import models
from ..schemas import schemas
import uuid

router = APIRouter(prefix="/feedback", tags=["feedback"])

@router.post("/")
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    db_feedback = models.Feedback(
        id=uuid.uuid4(),
        trace_id=feedback.trace_id,
        score=feedback.score,
        comment=feedback.comment
    )
    db.add(db_feedback)
    db.commit()
    return {"status": "ok", "id": str(db_feedback.id)}
