from typing import Dict, Any, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from ..models import models
from loguru import logger

class FeedbackLoopService:
    """
    Manages human-in-the-loop (HITL) feedback for AI responses.
    This creates the 'ground truth' required for fine-tuning and evaluation calibration.
    """
    
    def __init__(self, db: Session):
        self.db = db

    def submit_feedback(self, trace_id: UUID, score: float, comment: Optional[str] = None, metadata: Dict[str, Any] = {}) -> models.Feedback:
        """
        Record user or reviewer feedback for a specific trace.
        """
        feedback = models.Feedback(
            trace_id=trace_id,
            score=score,
            comment=comment,
            metadata=metadata
        )
        self.db.add(feedback)
        
        # Link to evaluation system: Create a 'Human' evaluation record
        evaluation = models.Evaluation(
            trace_id=trace_id,
            evaluator_type="human",
            score=score,
            reasoning=comment or "Manually reviewed by human"
        )
        self.db.add(evaluation)
        
        self.db.commit()
        self.db.refresh(feedback)
        
        logger.info(f"Human feedback recorded for trace {trace_id}: {score}")
        return feedback

    def get_golden_dataset(self, project_id: UUID, min_score: float = 0.9) -> list[models.Trace]:
        """
        Retrieves traces that have been human-verified as high quality.
        """
        return self.db.query(models.Trace).join(models.Feedback).filter(
            models.Trace.project_id == project_id,
            models.Feedback.score >= min_score
        ).all()
