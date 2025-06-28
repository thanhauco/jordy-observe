from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models import models

class CostAnalyticsService:
    """
    Provides deep financial observability into LLM spend.
    Calculates ROI and cost efficiency per model and per project.
    """
    
    def __init__(self, db: Session):
        self.db = db

    def get_cost_distribution(self, project_id: str) -> Dict[str, Any]:
        """
        Aggregate costs across models for a specific project.
        """
        stats = self.db.query(
            models.Trace.metadata["model"].astext.label("model"),
            func.sum(models.Trace.total_cost_usd).label("total_cost"),
            func.count(models.Trace.id).label("request_count")
        ).filter(models.Trace.project_id == project_id).group_by("model").all()

        return {
            "by_model": [
                {
                    "model": s.model or "unknown",
                    "cost": float(s.total_cost or 0),
                    "requests": s.request_count,
                    "avg_cost": float(s.total_cost / s.request_count) if s.request_count > 0 else 0
                }
                for s in stats
            ],
            "total_project_spend": sum(float(s.total_cost or 0) for s in stats)
        }

    def identify_inefficient_prompts(self, project_id: str, cost_threshold: float = 0.05) -> List[Dict[str, Any]]:
        """
        Finds traces that cost significantly more than average but have low evaluation scores.
        """
        inefficient = self.db.query(models.Trace).join(models.Evaluation).filter(
            models.Trace.project_id == project_id,
            models.Trace.total_cost_usd > cost_threshold,
            models.Evaluation.score < 0.5
        ).limit(10).all()

        return [
            {"trace_id": str(t.id), "cost": t.total_cost_usd, "tokens": t.total_tokens}
            for t in inefficient
        ]
