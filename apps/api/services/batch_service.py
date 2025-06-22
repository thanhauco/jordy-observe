from sqlalchemy.orm import Session
from ..models import models
from ..evaluators.llm_judge import LLMJudge
import uuid

class BatchService:
    @staticmethod
    async def run_batch_evaluation(db: Session, batch_run_id: uuid.UUID, dataset_id: uuid.UUID):
        items = db.query(models.DatasetItem).filter(
            models.DatasetItem.dataset_id == dataset_id
        ).all()
        
        evaluator = LLMJudge()
        
        for item in items:
            result = evaluator.evaluate(item.input, item.expected_output)
            batch_result = models.BatchResult(
                id=uuid.uuid4(),
                batch_run_id=batch_run_id,
                dataset_item_id=item.id,
                score=result.score,
                explanation=result.explanation
            )
            db.add(batch_result)
        
        db.commit()
